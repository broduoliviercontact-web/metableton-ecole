import { useState, useEffect } from 'react';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { getClassroomOAuthStatus, getGoogleClassroomCourses } from '../api/classroom.js';

// Re-export for local use -ErrorMessage is used in this file
import ErrorMessage from './ui/ErrorMessage.jsx';

export default function ClassroomConnectButton() {
  const [status, setStatus] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState(null); // null = not loaded
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    // Only load courses if Classroom is enabled AND connected
    if (status?.oauthEnabled && status?.connected) {
      loadCourses();
    }
  }, [status?.oauthEnabled, status?.connected]);

  async function loadStatus() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClassroomOAuthStatus();
      setStatus(data);
    } catch (err) {
      // 404/CLASSROOM_OAUTH_DISABLED is now handled by backend returning
      // oauthEnabled: false with status 200, so this catch block should
      // rarely be reached. Still kept for safety.
      if (err.status === 404) {
        setStatus({ connected: false, oauthEnabled: false });
      } else {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCourses() {
    if (!status?.connected) return;
    setIsCoursesLoading(true);
    setError(null);
    try {
      const data = await getGoogleClassroomCourses();
      setCourses(data.courses || []);
    } catch (err) {
      // 401/CLASSROOM_NOT_CONNECTED — just clear courses, no error needed
      if (err.status === 401 || err.status === 400 || err.status === 403) {
        setCourses([]);
      } else {
        setError(err);
      }
    } finally {
      setIsCoursesLoading(false);
    }
  }

  // Loading state (status)
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

  // Disabled state (oauthEnabled === false)
  if (status?.oauthEnabled === false) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
        <Badge variant="pending">Google Classroom désactivé</Badge>
        <span className="text-gray-400">La connexion est désactivée pour le moment.</span>
      </div>
    );
  }

  // Connected state with courses
  if (status?.connected && courses !== null) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
          <Badge variant="approved">Google Classroom connecté</Badge>
        </div>
        {isCoursesLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <LoadingSpinner size="sm" />
            <span>Chargement des cours...</span>
          </div>
        )}
        {!isCoursesLoading && courses && courses.length > 0 && (
          <div className="text-sm text-gray-400">
            {courses.length} cours Google Classroom
          </div>
        )}
        {!isCoursesLoading && courses && courses.length === 0 && (
          <EmptyState
            icon="🎓"
            title="Aucun cours Google Classroom"
            description="Vous n'avez pas encore de cours dans Google Classroom."
          />
        )}
      </div>
    );
  }

  // Not connected state (enabled but no token)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">
        Connectez votre compte Google Classroom pour synchroniser vos cours.
      </span>
      <Button size="sm" onClick={() => window.location.href = '/api/classroom/oauth/start'}>
        Connecter Google Classroom
      </Button>
    </div>
  );
}
