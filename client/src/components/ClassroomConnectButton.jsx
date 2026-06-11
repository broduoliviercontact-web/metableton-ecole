import { useState, useEffect } from 'react';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import ErrorMessage from './ui/ErrorMessage.jsx';
import { getClassroomOAuthStatus, connectGoogleClassroom } from '../api/classroom.js';

export default function ClassroomConnectButton() {
  const [status, setStatus] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClassroomOAuthStatus();
      setStatus(data);
    } catch (err) {
      // If 404/disabled, it's not an error — just not connected
      if (err.status === 404) {
        setStatus({ connected: false, hasClassroomAccess: false });
      } else {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <LoadingSpinner size="sm" />
        <span>Chargement...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-sm text-red-300">
        <ErrorMessage
          title="Erreur de chargement"
          message={error.message || 'Impossible de charger le statut Classroom.'}
          onRetry={loadStatus}
        />
      </div>
    );
  }

  // Connected state
  if (status?.connected && status?.hasClassroomAccess) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
        <Badge variant="approved">Google Classroom connecté</Badge>
      </div>
    );
  }

  // Not connected state
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">
        Connectez votre compte Google Classroom pour synchroniser vos cours.
      </span>
      <Button size="sm" onClick={() => connectGoogleClassroom()}>
        Connecter Google Classroom
      </Button>
    </div>
  );
}
