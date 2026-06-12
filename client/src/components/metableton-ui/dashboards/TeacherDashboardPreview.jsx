/* TeacherDashboardPreview — assemble les parts à partir de teacherDashboardConfig. */
import React from 'react';
import DashboardShell from './DashboardShell.jsx';
import DashboardHeader from './parts/DashboardHeader.jsx';
import DashboardStatGrid from './parts/DashboardStatGrid.jsx';
import DashboardPanel from './parts/DashboardPanel.jsx';
import BarChart from './parts/BarChart.jsx';
import AssignmentTable from './parts/AssignmentTable.jsx';
import { teacherDashboardConfig } from './dashboardFixtures.js';

export default function TeacherDashboardPreview({ config = teacherDashboardConfig }) {
  const {
    profile,
    navItems,
    activeIndex,
    header,
    stats,
    weeklyActivity,
    assignments,
  } = config;

  return (
    <DashboardShell
      profile={profile}
      navItems={navItems}
      activeIndex={activeIndex}
    >
      {header && <DashboardHeader title={header.title} rightSlot={header.rightSlot} />}

      {stats && stats.length > 0 && <DashboardStatGrid stats={stats} />}

      {(weeklyActivity?.values?.length > 0 || assignments?.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '16px',
          }}
        >
          {weeklyActivity?.values?.length > 0 && (
            <DashboardPanel title="Activité hebdomadaire" hover={false}>
              <BarChart
                values={weeklyActivity.values}
                labels={weeklyActivity.labels}
              />
            </DashboardPanel>
          )}

          {assignments?.length > 0 && (
            <AssignmentTable assignments={assignments} />
          )}
        </div>
      )}
    </DashboardShell>
  );
}
