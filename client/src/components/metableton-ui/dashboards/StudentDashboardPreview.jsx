/* StudentDashboardPreview — assemble les parts à partir de studentDashboardConfig.
   Court, déclaratif. Pour retirer une section, retirer la clé correspondante
   de la config (ou la mettre à tableau vide). */
import React from 'react';
import DashboardShell from './DashboardShell.jsx';
import DashboardHeader from './parts/DashboardHeader.jsx';
import DashboardStatGrid from './parts/DashboardStatGrid.jsx';
import DashboardPanel from './parts/DashboardPanel.jsx';
import CourseProgressList from './parts/CourseProgressList.jsx';
import SessionGrid from './parts/SessionGrid.jsx';
import { studentDashboardConfig } from './dashboardFixtures.js';

export default function StudentDashboardPreview({ config = studentDashboardConfig }) {
  const {
    profile,
    navItems,
    activeIndex,
    header,
    stats,
    courseProgress,
    sessions,
  } = config;

  return (
    <DashboardShell
      profile={profile}
      navItems={navItems}
      activeIndex={activeIndex}
    >
      {header && <DashboardHeader title={header.title} rightSlot={header.rightSlot} />}

      {stats && stats.length > 0 && <DashboardStatGrid stats={stats} />}

      {/* Zone 2 cartes : Cours en cours + Prochaines sessions.
          Chaque DashboardPanel est conditionné à la présence de ses données. */}
      {(courseProgress?.length > 0 || sessions?.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {courseProgress?.length > 0 && (
            <DashboardPanel title="Cours en cours">
              <CourseProgressList courses={courseProgress} />
            </DashboardPanel>
          )}

          {sessions?.length > 0 && (
            <DashboardPanel title="Prochaines sessions (Agenda)">
              <SessionGrid sessions={sessions} />
            </DashboardPanel>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
