import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import ClassroomConnectButton from '../../components/ClassroomConnectButton.jsx';
import { getUsers, updateUserRole, deleteUser } from '../../api/admin.js';
import { useAuth } from '../../hooks/useAuth.js';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Étudiant' },
  { value: 'teacher', label: 'Enseignant' },
  { value: 'admin', label: 'Administrateur' },
];

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which user id currently has an update in flight so we can
  // disable only that row's controls.
  const [savingId, setSavingId] = useState(null);
  // Per-row transient error message (e.g. LAST_ADMIN) shown under the row.
  const [rowErrors, setRowErrors] = useState({});

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete a user with confirmation.
  async function handleDeleteUser(userId, userEmail) {
    if (!window.confirm(
      `Supprimer définitivement ${userEmail || 'cet utilisateur'} ?\n\nCette action est irréversible : toutes les données associées (inscriptions, invitations) seront supprimées.`
    )) {
      return;
    }

    // Optimistic: remove from list
    setUsers((prev) => prev ? prev.filter((u) => u.id !== userId) : prev);

    try {
      await deleteUser(userId);
      await loadUsers(); // refresh from server
    } catch (err) {
      // Rollback: reload the full list
      await loadUsers();
      alert(err.message || 'Impossible de supprimer cet utilisateur.');
    }
  }

  // Apply a role change: optimistic + server refresh on success, rollback on error.
  async function handleRoleChange(userId, newRole, previousRole) {
    setSavingId(userId);
    setRowErrors((prev) => ({ ...prev, [userId]: null }));

    // Optimistic: update the row in place.
    setUsers((prev) =>
      prev ? prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)) : prev
    );

    try {
      await updateUserRole(userId, newRole);
      // Server is the source of truth — refetch.
      await loadUsers();
    } catch (err) {
      // Roll back to the previous role.
      setUsers((prev) =>
        prev
          ? prev.map((u) => (u.id === userId ? { ...u, role: previousRole } : u))
          : prev
      );
      setRowErrors((prev) => ({
        ...prev,
        [userId]:
          err.message || "Impossible de modifier le rôle. Veuillez réessayer.",
      }));
    } finally {
      setSavingId(null);
    }
  }

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Pilotage Metableton</h1>
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Pilotage Metableton</h1>
        <ErrorMessage
          title="Impossible de charger les utilisateurs"
          message={error.message || 'Une erreur est survenue lors du chargement.'}
          onRetry={loadUsers}
        />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (!users || users.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Pilotage Metableton</h1>
        <EmptyState
          icon="👥"
          title="Aucun utilisateur pour le moment"
          description="Les utilisateurs apparaîtront ici après leur première connexion via Google."
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pilotage Metableton</h1>
        <div className="flex items-center gap-3">
          <ClassroomConnectButton />
          <Link
            to="/dashboard/admin/courses"
            className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            aria-label="Voir tous les cours de la plateforme"
          >
            Voir tous les cours →
          </Link>
        </div>
      </div>
      <p className="mb-6 text-sm text-gray-400">
        {users.length} utilisateur{users.length > 1 ? 's' : ''}
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Utilisateurs</h2>
        <div className="space-y-3">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isCurrentUser={u.id === currentUser?.userId}
              isSaving={savingId === u.id}
              rowError={rowErrors[u.id]}
              onChangeRole={(newRole) => handleRoleChange(u.id, newRole, u.role)}
              onDelete={() => handleDeleteUser(u.id, u.email)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── UserRow ──────────────────────────────────────────────────────────
// One user with avatar, identity, role select + save, and per-row errors.
function UserRow({ user, isCurrentUser, isSaving, rowError, onChangeRole, onDelete }) {
  const [pendingRole, setPendingRole] = useState(user.role);
  const isDirty = pendingRole !== user.role;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={user.avatar_url} name={user.display_name} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="truncate font-medium text-white">
                {user.display_name || 'Utilisateur'}
              </span>
              {isCurrentUser && (
                <span className="text-xs text-gray-500">(vous)</span>
              )}
            </div>
            <div className="truncate text-sm text-gray-400">{user.email}</div>
            {user.created_at && (
              <div className="mt-0.5 text-xs text-gray-500">
                Inscrit le {formatDate(user.created_at)}
              </div>
            )}
          </div>
        </div>

        {/* Role + save + delete */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant={user.role}>{ROLE_LABEL[user.role] || user.role}</Badge>
          <select
            value={pendingRole}
            onChange={(e) => setPendingRole(e.target.value)}
            disabled={isSaving}
            aria-label="Changer le rôle"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() => onChangeRole(pendingRole)}
            disabled={!isDirty || isSaving}
            aria-label="Enregistrer le nouveau rôle"
          >
            {isSaving ? '…' : 'Enregistrer'}
          </Button>
          {!isCurrentUser && (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              aria-label={`Supprimer ${user.email}`}
            >
              🗑
            </Button>
          )}
        </div>
      </div>

      {rowError && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {rowError}
        </div>
      )}
    </div>
  );
}

const ROLE_LABEL = {
  student: 'Étudiant',
  teacher: 'Enseignant',
  admin: 'Administrateur',
};

// ── Avatar ───────────────────────────────────────────────────────────
// Renders the user's avatar if a URL is present, otherwise a circular
// initial so the row is never empty.
function Avatar({ src, name }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-gray-300"
    >
      {initial}
    </div>
  );
}
