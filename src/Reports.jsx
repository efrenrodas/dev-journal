import { useState, useEffect, useCallback } from 'react';

function Reports() {
  const [entries, setEntries] = useState([]);
  const [timeframe, setTimeframe] = useState('day');

  const loadEntries = useCallback(async () => {
    if (window.api && window.api.getEntries) {
      try {
        const data = await window.api.getEntries(timeframe);
        setEntries(data);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      }
    }
  }, [timeframe]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadEntries();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadEntries]);

  const calculateDuration = (init, end) => {
    if (!end) return 'En progreso...';
    const startD = new Date(init.replace(' ', 'T'));
    const endD = new Date(end.replace(' ', 'T'));
    
    const diffMs = endD - startD;
    if (isNaN(diffMs) || diffMs < 0) return '0 min';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours > 0) {
      const remainingMins = diffMins % 60;
      return `${diffHours}h ${remainingMins}m`;
    }
    return `${diffMins} min`;
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString.replace(' ', 'T'));
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Reporte de Actividades</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeframe === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setTimeframe('day')}
        >
          Día
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeframe === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setTimeframe('week')}
        >
          Semana
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setTimeframe('month')}
        >
          Mes
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold border-b border-gray-200">Fecha</th>
              <th className="p-4 font-semibold border-b border-gray-200">Actividad</th>
              <th className="p-4 font-semibold border-b border-gray-200">Tiempo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {entries.length > 0 ? entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-white transition-colors">
                <td className="p-4 whitespace-nowrap text-sm">{formatDate(entry.hour_init)}</td>
                <td className="p-4 font-medium">{entry.text}</td>
                <td className="p-4 whitespace-nowrap font-medium text-blue-600">{calculateDuration(entry.hour_init, entry.hour_end)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">No hay actividades en este rango de tiempo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
