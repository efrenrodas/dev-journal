function ActivityPromptModal({
  isOpen,
  activeEntry,
  activityText,
  onActivityTextChange,
  onStartNewTask,
  onKeepGoing,
  onSnooze
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">¿Qué estás haciendo?</h2>

        {activeEntry && (
          <div className="mb-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">¿Sigues en esto?</p>
            <p className="font-bold text-gray-800 text-lg mb-4">{activeEntry.text}</p>
            <button
              onClick={onKeepGoing}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              Sigo en la misma actividad
            </button>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {activeEntry ? 'O empieza una nueva actividad' : 'Nueva actividad'}
          </label>
          <input
            type="text"
            value={activityText}
            onChange={(e) => onActivityTextChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onStartNewTask()}
            placeholder="Escribe lo que vas a hacer..."
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all text-gray-800"
            autoFocus
          />
          <button
            onClick={onStartNewTask}
            disabled={!activityText.trim()}
            className="mt-3 w-full bg-green-500 text-white font-medium py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-green-200"
          >
            Registrar nueva tarea
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">Posponer</p>
          <div className="flex gap-3">
            <button onClick={() => onSnooze(10)} className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors">10 min</button>
            <button onClick={() => onSnooze(15)} className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors">15 min</button>
            <button onClick={() => onSnooze(30)} className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors">30 min</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPromptModal;
