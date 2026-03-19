import { useState, useEffect } from 'react';
import Reports from './Reports';
import Settings from './Settings';
import CurrentActivityCard from './components/CurrentActivityCard';
import AppActions from './components/AppActions';
import ActivityPromptModal from './components/ActivityPromptModal';

function App() {
  const [currentView, setCurrentView] = useState('activities');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityText, setActivityText] = useState('');
  const [activeEntry, setActiveEntry] = useState(null);

  const loadActiveEntry = async () => {
    if (window.api && window.api.getActiveEntry) {
      try {
        const entry = await window.api.getActiveEntry();
        setActiveEntry(entry);
      } catch (err) {
        console.error("Error cargando actividad:", err);
      }
    }
  };

  const checkInitialCronStatus = async () => {
    if (window.api && window.api.getCronStatus) {
      try {
        const status = await window.api.getCronStatus();
        if (status.isPromptActive) {
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Error revisando estado del cron:", err);
      }
    }
  };

  useEffect(() => {
    const initApp = async () => {
      await loadActiveEntry();
      await checkInitialCronStatus();
    };

    initApp();

    if (window.api && window.api.onPromptActivity) {
      window.api.onPromptActivity(() => {
        loadActiveEntry();
        setIsModalOpen(true);
      });
    }

    if (window.api && window.api.onOpenReports) {
      window.api.onOpenReports(() => {
        setCurrentView('reports');
      });
    }

    if (window.api && window.api.onShowActivities) {
      window.api.onShowActivities(() => {
        setCurrentView('activities');
      });
    }

    if (window.api && window.api.onOpenSettings) {
      window.api.onOpenSettings(() => {
        setCurrentView('settings');
      });
    }
  }, []);

  const handleStartNewTask = async () => {
    if (!activityText.trim()) return;
    try {
      await window.api.startEntry(activityText);
      setActivityText('');
      setIsModalOpen(false);
      loadActiveEntry();
      // Ocultar ventana de Electron
      if (window.api && window.api.hideWindow) window.api.hideWindow();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSnooze = async (minutes) => {
    await window.api.snooze(minutes);
    setIsModalOpen(false);
    // Ocultar ventana de Electron
    if (window.api && window.api.hideWindow) window.api.hideWindow();
  };

  const handleKeepGoing = async () => {
    await window.api.resetCron();
    setIsModalOpen(false);
    // Ocultar ventana de Electron
    if (window.api && window.api.hideWindow) window.api.hideWindow();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Dev Journal</h1>

        <CurrentActivityCard activeEntry={activeEntry} />

        <AppActions
          onNewTask={() => setIsModalOpen(true)}
        />
      </div>

      {currentView === 'reports' && <Reports />}
      {currentView === 'settings' && <Settings />}

      <ActivityPromptModal
        isOpen={isModalOpen}
        activeEntry={activeEntry}
        activityText={activityText}
        onActivityTextChange={setActivityText}
        onStartNewTask={handleStartNewTask}
        onKeepGoing={handleKeepGoing}
        onSnooze={handleSnooze}
      />
    </div>
  );
}

export default App;
