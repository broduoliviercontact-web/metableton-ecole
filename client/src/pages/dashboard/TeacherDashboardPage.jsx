import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function TeacherDashboardPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tableau de bord enseignant</h1>
        <Button disabled>Créer un cours</Button>
      </div>
      <EmptyState
        icon="🎓"
        title="Aucun cours créé"
        description="Créez votre premier cours et liez-le à un Google Classroom."
      />
    </div>
  );
}
