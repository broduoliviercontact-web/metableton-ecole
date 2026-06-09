import EmptyState from '../../components/ui/EmptyState.jsx';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Administration</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-2 font-semibold text-white">Utilisateurs</h2>
          <p className="text-sm text-gray-400">Gérez les rôles et les profils.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-2 font-semibold text-white">Cours</h2>
          <p className="text-sm text-gray-400">Supervisez tous les cours de la plateforme.</p>
        </div>
      </div>
    </div>
  );
}
