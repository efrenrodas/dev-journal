function AppActions({ onNewTask }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={onNewTask}
        className="text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
      >
        ⚙️ Nuevo
      </button>
    </div>
  );
}

export default AppActions;
