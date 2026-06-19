import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockData = {};

// ── Mock query builder ─────────────────────────────────────────────────────
// Mirrors the subset of the Supabase JS client used by adminService.
function createMockBuilder(records) {
  let filters = [];
  let isDelete = false;
  let countMode = false;
  let updateValues = null;

  function applyFilters() {
    return records.filter((r) =>
      filters.every(({ field, value }) => r[field] === value)
    );
  }

  function removeFiltered() {
    const matched = applyFilters();
    const matchedIds = new Set(matched.map((r) => r.id));
    // Mutate the backing array so later reads see the deletion.
    records.splice(0, records.length, ...records.filter((r) => !matchedIds.has(r.id)));
    return matched;
  }

  const builder = {
    select(fields, options) {
      // Terminal after a delete: execute the deletion and return removed rows.
      if (isDelete) {
        const deletedRows = removeFiltered();
        return Promise.resolve({ data: deletedRows, error: null });
      }

      // Count mode: select('*', { count: 'exact', head: true })
      if (options?.count === 'exact' && options?.head) {
        countMode = true;
      }
      return builder;
    },
    eq(field, value) {
      filters.push({ field, value });
      if (countMode) {
        const count = applyFilters().length;
        return Promise.resolve({ count, error: null });
      }
      return builder;
    },
    maybeSingle() {
      const matched = applyFilters();
      return Promise.resolve({ data: matched[0] || null, error: null });
    },
    single() {
      const matched = applyFilters();
      if (!matched.length) {
        return Promise.resolve({ data: null, error: { message: 'Not found' } });
      }
      return Promise.resolve({ data: matched[0], error: null });
    },
    order() {
      // No-op for tests; real data order doesn't matter here.
      return builder;
    },
    update(updates) {
      updateValues = updates;
      return {
        eq(field, value) {
          return {
            select() {
              return {
                single() {
                  const idx = records.findIndex((r) => r[field] === value);
                  if (idx >= 0) {
                    Object.assign(records[idx], updateValues);
                    return Promise.resolve({ data: records[idx], error: null });
                  }
                  return Promise.resolve({ data: null, error: { message: 'Not found' } });
                },
              };
            },
          };
        },
      };
    },
    delete() {
      isDelete = true;
      return builder;
    },
    // Make the chain awaitable (e.g. listAllUsers ends with .order()).
    then(resolve) {
      resolve({ data: applyFilters(), error: null });
    },
  };

  return builder;
}

function createMockClient(tables = {}) {
  // Reset mutable arrays per test
  Object.keys(tables).forEach((key) => {
    mockData[key] = [...tables[key]];
  });

  return {
    from: vi.fn((tableName) => createMockBuilder(mockData[tableName] || [])),
  };
}

// ── Mock Supabase client before importing the service ────────────────────────
vi.mock('../config/supabase.js', () => ({
  getSupabase: vi.fn(async () => createMockClient(mockData)),
}));

import * as adminService from './adminService.js';
import { getSupabase } from '../config/supabase.js';

// ── Tests ───────────────────────────────────────────────────────────────────
describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockData).forEach((key) => delete mockData[key]);
  });

  describe('listAllUsers', () => {
    it('returns all profiles ordered by created_at', async () => {
      createMockClient({
        profiles: [
          { id: 'u-1', email: 'a@example.com', display_name: 'A', role: 'student', created_at: '2026-01-02' },
          { id: 'u-2', email: 'b@example.com', display_name: 'B', role: 'teacher', created_at: '2026-01-01' },
        ],
      });

      const users = await adminService.listAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].id).toBe('u-1');
      expect(users[1].id).toBe('u-2');
    });
  });

  describe('getUserById', () => {
    it('returns the requested profile', async () => {
      createMockClient({
        profiles: [{ id: 'u-1', email: 'a@example.com', display_name: 'A', role: 'student', created_at: '2026-01-01' }],
      });

      const user = await adminService.getUserById('u-1');

      expect(user).toBeTruthy();
      expect(user.id).toBe('u-1');
    });

    it('returns null for an unknown id', async () => {
      createMockClient({ profiles: [] });

      const user = await adminService.getUserById('missing');

      expect(user).toBeNull();
    });
  });

  describe('countAdmins', () => {
    it('counts only admin profiles', async () => {
      createMockClient({
        profiles: [
          { id: 'u-1', role: 'admin' },
          { id: 'u-2', role: 'admin' },
          { id: 'u-3', role: 'student' },
        ],
      });

      const count = await adminService.countAdmins();

      expect(count).toBe(2);
    });
  });

  describe('updateUserRole', () => {
    it('updates the role and returns the updated profile', async () => {
      createMockClient({
        profiles: [
          { id: 'u-1', email: 'a@example.com', display_name: 'A', role: 'student', created_at: '2026-01-01', updated_at: '2026-01-01' },
        ],
      });

      const updated = await adminService.updateUserRole('u-1', 'teacher');

      expect(updated.role).toBe('teacher');
      expect(updated.updated_at).not.toBe('2026-01-01');
    });
  });

  describe('deleteUser', () => {
    it('deletes an existing profile and returns the deleted id', async () => {
      createMockClient({
        profiles: [
          { id: 'u-1', email: 'a@example.com', display_name: 'A', role: 'student', created_at: '2026-01-01' },
        ],
      });

      const result = await adminService.deleteUser('u-1');

      expect(result).toEqual({ deleted: true, id: 'u-1' });
      expect(mockData.profiles).toHaveLength(0);
    });

    it('throws 404 if the profile does not exist', async () => {
      createMockClient({ profiles: [] });

      await expect(adminService.deleteUser('missing')).rejects.toEqual(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
          code: 'NOT_FOUND',
        })
      );
    });

    it('throws DELETE_FAILED when the database removes zero rows', async () => {
      // Simulate the case where Supabase returns success but no rows were
      // deleted (e.g. RLS silently filtered the row). The first from() call is
      // the lookup; the second is the delete chain and must return [] from
      // select().
      let fromCallCount = 0;
      const mockClient = {
        from: vi.fn(() => {
          fromCallCount++;
          if (fromCallCount === 1) {
            return createMockBuilder([
              { id: 'u-1', email: 'a@example.com', display_name: 'A', role: 'student', created_at: '2026-01-01' },
            ]);
          }
          return {
            delete: () => ({
              eq: () => ({
                select: () => Promise.resolve({ data: [], error: null }),
              }),
            }),
          };
        }),
      };

      getSupabase.mockResolvedValueOnce(mockClient);

      await expect(adminService.deleteUser('u-1')).rejects.toEqual(
        expect.objectContaining({
          statusCode: 409,
          code: 'DELETE_FAILED',
        })
      );
    });
  });
});
