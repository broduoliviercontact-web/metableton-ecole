import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFns = {
  getUserById: vi.fn(),
  countAdmins: vi.fn(),
  deleteUser: vi.fn(),
};

vi.mock('../services/adminService.js', () => ({
  getUserById: (...args) => mockFns.getUserById(...args),
  countAdmins: (...args) => mockFns.countAdmins(...args),
  deleteUser: (...args) => mockFns.deleteUser(...args),
  VALID_ROLES: ['student', 'teacher', 'admin'],
  default: {},
}));

import { deleteUserHandler } from './admin.js';

function createMockRes() {
  const res = {};
  res.status = vi.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn((body) => {
    res.body = body;
    return res;
  });
  return res;
}

function createMockNext() {
  return vi.fn((err) => {
    throw err;
  });
}

describe('DELETE /api/admin/users/:userId handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes the user and returns the service result', async () => {
    const userId = '78e6e0a2-d114-4f3b-a304-25cd2c0f686b';
    const adminId = '11111111-1111-1111-1111-111111111111';
    mockFns.getUserById.mockResolvedValue({ id: userId, role: 'student' });
    mockFns.deleteUser.mockResolvedValue({ deleted: true, id: userId });

    const req = { params: { userId }, user: { userId: adminId } };
    const res = createMockRes();
    const next = createMockNext();

    await deleteUserHandler(req, res, next);

    expect(mockFns.getUserById).toHaveBeenCalledWith(userId);
    expect(mockFns.deleteUser).toHaveBeenCalledWith(userId);
    expect(res.json).toHaveBeenCalledWith({ data: { deleted: true, id: userId } });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a missing userId with 400 USER_ID_REQUIRED', async () => {
    const req = { params: {}, user: { userId: 'admin-id' } };
    const res = createMockRes();
    const next = createMockNext();

    await deleteUserHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'USER_ID_REQUIRED' }),
      })
    );
    expect(mockFns.deleteUser).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects self-deletion with 403 CANNOT_DELETE_SELF', async () => {
    const userId = '78e6e0a2-d114-4f3b-a304-25cd2c0f686b';
    const req = { params: { userId }, user: { userId } };
    const res = createMockRes();
    const next = createMockNext();

    await deleteUserHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'CANNOT_DELETE_SELF' }),
      })
    );
    expect(mockFns.deleteUser).not.toHaveBeenCalled();
  });

  it('rejects deleting the last admin with 409 LAST_ADMIN', async () => {
    const userId = '78e6e0a2-d114-4f3b-a304-25cd2c0f686b';
    const adminId = '11111111-1111-1111-1111-111111111111';
    mockFns.getUserById.mockResolvedValue({ id: userId, role: 'admin' });
    mockFns.countAdmins.mockResolvedValue(1);

    const req = { params: { userId }, user: { userId: adminId } };
    const res = createMockRes();
    const next = createMockNext();

    await deleteUserHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'LAST_ADMIN' }),
      })
    );
    expect(mockFns.deleteUser).not.toHaveBeenCalled();
  });

  it('returns 404 when the target user does not exist', async () => {
    const userId = '78e6e0a2-d114-4f3b-a304-25cd2c0f686b';
    mockFns.getUserById.mockResolvedValue(null);

    const req = { params: { userId }, user: { userId: 'admin-id' } };
    const res = createMockRes();
    const next = createMockNext();

    await deleteUserHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'NOT_FOUND' }),
      })
    );
  });

  it('calls next(err) when the service throws', async () => {
    const userId = '78e6e0a2-d114-4f3b-a304-25cd2c0f686b';
    const error = new Error('database down');
    mockFns.getUserById.mockRejectedValue(error);

    const req = { params: { userId }, user: { userId: 'admin-id' } };
    const res = createMockRes();
    const next = createMockNext();

    await expect(deleteUserHandler(req, res, next)).rejects.toBe(error);
    expect(next).toHaveBeenCalledWith(error);
  });
});
