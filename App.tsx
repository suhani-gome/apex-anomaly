import { useState } from 'react';
import { Sidebar, type ViewId } from '@/components/Sidebar';
import { Dashboard } from '@/components/views/Dashboard';
import { DocumentsView } from '@/components/views/DocumentsView';
import { TimelineView } from '@/components/views/TimelineView';
import { AppointmentsView } from '@/components/views/AppointmentsView';
import { TasksView } from '@/components/views/TasksView';
import { RemindersView } from '@/components/views/RemindersView';
import { BriefingView } from '@/components/views/BriefingView';
import { PrivacyView } from '@/components/views/PrivacyView';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui';

function App() {
  const [view, setView] = useState<ViewId>('dashboard');
  const data = usePatientData();

  if (data.loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Initializing CareNav AI..." />
      </div>
    );
  }

  if (data.error || !data.patient) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-error-50 flex items-center justify-center text-error-500 mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Something went wrong</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {data.error ?? 'Unable to load patient data. Please try refreshing the page.'}
          </p>
        </div>
      </div>
    );
  }

  const pendingTaskCount = data.tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const pendingReminderCount = data.reminders.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar
        current={view}
        onNavigate={setView}
        taskCount={pendingTaskCount}
        reminderCount={pendingReminderCount}
        documentCount={data.documents.length}
      />
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && <Dashboard data={data} onNavigate={setView} />}
          {view === 'documents' && <DocumentsView data={data} />}
          {view === 'timeline' && <TimelineView data={data} />}
          {view === 'appointments' && <AppointmentsView data={data} />}
          {view === 'tasks' && <TasksView data={data} />}
          {view === 'reminders' && <RemindersView data={data} />}
          {view === 'briefing' && <BriefingView data={data} />}
          {view === 'privacy' && <PrivacyView data={data} />}
        </div>
      </main>
    </div>
  );
}

export default App;
