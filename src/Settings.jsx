import { useEffect, useState } from 'react';

function Settings() {
  const [startTime, setStartTime] = useState('08:00');
  const [breakTime, setBreakTime] = useState('12:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (!window.api || !window.api.getSettings) return;

      try {
        const settings = await window.api.getSettings();
        if (!settings) return;

        setStartTime(settings.start_time || '08:00');
        setBreakTime(settings.break_time || '12:00');
        setEndTime(settings.end_time || '17:00');
      } catch (error) {
        console.error('Error cargando configuración:', error);
        setStatusMessage('No se pudo cargar la configuración.');
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!window.api || !window.api.updateSettings) return;

    setIsSaving(true);
    setStatusMessage('');

    try {
      await window.api.updateSettings(startTime, breakTime, endTime);
      setStatusMessage('Configuración guardada correctamente.');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setStatusMessage('No se pudo guardar la configuración.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Configuración</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Inicio jornada</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Pausa</span>
          <input
            type="time"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Fin jornada</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar configuración'}
        </button>
        {statusMessage && <p className="text-sm text-gray-600">{statusMessage}</p>}
      </div>
    </div>
  );
}

export default Settings;
