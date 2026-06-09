import EmptyState from '../../components/ui/EmptyState.jsx';

export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Mon tableau de bord</h1>
      <EmptyState
        icon="📚"
        title="Aucun cours pour le moment"
        description="Parcourez le catalogue et demandez votre inscription à un cours."
      />
    </div>
  );
}
