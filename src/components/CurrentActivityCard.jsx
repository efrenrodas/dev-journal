function CurrentActivityCard({ activeEntry }) {
  if (activeEntry) {
    return (
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-1">Actividad en curso</p>
        <p className="text-xl font-bold text-indigo-700">{activeEntry.text}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
      <p className="text-gray-500">Aún no has registrado ninguna actividad hoy.</p>
    </div>
  );
}

export default CurrentActivityCard;
