import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client at module level - hoisted before any imports
const mockClients = {};

// Helper to build a chainable mock query builder
function buildQuery(table, records, operations = []) {
  return {
    table,
    records,
    operations,
    select: (fields) => {
      return buildQuery(table, records, [...operations, { type: 'select', fields }]);
    },
    eq: (field, value) => {
      return buildQuery(table, records, [...operations, { type: 'eq', field, value }]);
    },
    maybeSingle: vi.fn(async () => {
      // Process operations to filter records
      let filtered = [...records];
      for (const op of operations) {
        if (op.type === 'eq') {
          filtered = filtered.filter((r) => r[op.field] === op.value);
        }
      }
      // For single result, return first match or null
      const result = filtered.length > 0 ? filtered[0] : null;
      return { data: result, error: null };
    }),
    single: vi.fn(async () => {
      const result = await this.maybeSingle();
      return result;
    }),
    upsert: vi.fn((record, options) => {
      // Check for conflict
      let existing = null;
      for (const r of records) {
        let match = true;
        if (options?.onConflict) {
          const conflictFields = options.onConflict.split(',').map((f) => f.trim());
          for (const f of conflictFields) {
            if (r[f] !== record[f]) {
              match = false;
              break;
            }
          }
        } else {
          match = r.id === record.id;
        }
        if (match) {
          existing = r;
          break;
        }
      }

      if (existing) {
        const updated = { ...existing, ...record };
        const idx = records.indexOf(existing);
        records[idx] = updated;
        return { select: () => ({ single: vi.fn(async () => ({ data: updated, error: null })) }) };
      } else {
        const newRecord = {
          id: `generated-${table}-${Date.now()}`,
          ...record,
        };
        records.push(newRecord);
        return { select: () => ({ single: vi.fn(async () => ({ data: newRecord, error: null })) }) };
      }
    }),
    update: vi.fn((updates) => {
      return {
        eq: vi.fn((field, value) => {
          return {
            select: vi.fn(() => {
              return {
                single: vi.fn(async () => {
                  // Find and update the record
                  const record = records.find((r) => r[field] === value);
                  if (record) {
                    Object.assign(record, updates);
                    return { data: record, error: null };
                  }
                  return { data: null, error: null };
                }),
              };
            }),
          };
        }),
      };
    }),
    order: vi.fn((field, options) => {
      return {
        eq: vi.fn((field2, value) => {
          return {
            maybeSingle: vi.fn(async () => ({ data: null, error: null })),
          };
        }),
      };
    }),
  };
}

function createMockClient(courses = [], enrollments = []) {
  return {
    from: vi.fn((tableName) => {
      const records = tableName === 'courses' ? courses : enrollments;
      return buildQuery(tableName, records);
    }),
  };
}

// Store mock clients for reuse
beforeEach(() => {
  mockClients.default = createMockClient([], []);
});

// Mock Supabase at the top level (before imports)
vi.mock('../config/supabase.js', () => ({
  getSupabase: vi.fn(async () => mockClients.default),
}));

// Now import the service after mocks are set up
import * as enrollmentService from './enrollmentService.js';

// Helper to reset mock data for a specific test scenario
function resetMockData(courses = [], enrollments = []) {
  mockClients.default = createMockClient(courses, enrollments);
}

describe('enrollmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestEnrollment', () => {
    it('creates a pending enrollment for a published course', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [];
      resetMockData(courses, enrollments);

      const result = await enrollmentService.requestEnrollment('student-1', 'course-1');

      expect(result.status).toBe('pending');
      expect(result.student_id).toBe('student-1');
      expect(result.course_id).toBe('course-1');
    });

    it('refuses a nonexistent course (404)', async () => {
      const courses = [];
      const enrollments = [];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.requestEnrollment('student-1', 'nonexistent-course')).rejects.toEqual(
        expect.objectContaining({
          message: 'Course not found',
          statusCode: 404,
        })
      );
    });

    it('refuses a draft/unpublished course (400)', async () => {
      const courses = [{ id: 'course-1', status: 'draft', title: 'Draft Course' }];
      const enrollments = [];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.requestEnrollment('student-1', 'course-1')).rejects.toEqual(
        expect.objectContaining({
          message: 'Course is not open for enrollment',
          statusCode: 400,
        })
      );
    });

    it('refuses an already pending enrollment (ALREADY_PENDING)', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'pending' },
      ];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.requestEnrollment('student-1', 'course-1')).rejects.toEqual(
        expect.objectContaining({
          message: 'You already have a pending request for this course.',
          statusCode: 409,
          code: 'ALREADY_PENDING',
        })
      );
    });

    it('refuses an already approved enrollment (ALREADY_APPROVED)', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'approved' },
      ];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.requestEnrollment('student-1', 'course-1')).rejects.toEqual(
        expect.objectContaining({
          message: 'You are already enrolled in this course.',
          statusCode: 409,
          code: 'ALREADY_APPROVED',
        })
      );
    });

    it('allows retry from rejected to pending', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'rejected' },
      ];
      resetMockData(courses, enrollments);

      const result = await enrollmentService.requestEnrollment('student-1', 'course-1');

      expect(result.status).toBe('pending');
      expect(result.previousStatus).toBe('rejected');
    });
  });

  describe('approveEnrollment', () => {
    it('approves a pending enrollment', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'pending' },
      ];
      resetMockData(courses, enrollments);

      const result = await enrollmentService.approveEnrollment('enrollment-1');

      expect(result.status).toBe('approved');
    });
  });

  describe('rejectEnrollment', () => {
    it('rejects a pending enrollment', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'pending' },
      ];
      resetMockData(courses, enrollments);

      const result = await enrollmentService.rejectEnrollment('enrollment-1');

      expect(result.status).toBe('rejected');
    });
  });

  describe('cancelEnrollment', () => {
    it('cancels an approved enrollment', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'approved' },
      ];
      resetMockData(courses, enrollments);

      const result = await enrollmentService.cancelEnrollment('enrollment-1');

      expect(result.status).toBe('cancelled');
    });
  });

  describe('transitionEnrollment (via public API)', () => {
    it('refuses transition if status is already approved (approve)', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'approved' },
      ];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.approveEnrollment('enrollment-1')).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('already approved'),
          statusCode: 400,
          code: 'INVALID_TRANSITION',
        })
      );
    });

    it('refuses transition if status is already rejected (reject)', async () => {
      const courses = [{ id: 'course-1', status: 'published', title: 'Test Course' }];
      const enrollments = [
        { id: 'enrollment-1', student_id: 'student-1', course_id: 'course-1', status: 'rejected' },
      ];
      resetMockData(courses, enrollments);

      await expect(enrollmentService.rejectEnrollment('enrollment-1')).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('already rejected'),
          statusCode: 400,
          code: 'INVALID_TRANSITION',
        })
      );
    });
  });
});
