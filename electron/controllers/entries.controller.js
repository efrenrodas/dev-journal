const entriesService = require('../services/entries.service');
const cronService = require('../services/cron.service');

function handleGetActiveEntry(event) {
    return entriesService.getActiveEntry();
}

function handleGetEntries(event, timeframe) {
    return entriesService.getEntries(timeframe);
}

function handleStartEntry(event, text) {
    if (!text || text.trim() === '') {
        throw new Error('El texto de la actividad no puede estar vacío');
    }
    
    const entry = entriesService.startEntry(text);
    // Como iniciamos una nueva tarea, reseteamos el cron para que pregunte en 1 hora
    cronService.resetTimer();
    
    return entry;
}

function handleCompleteActiveEntry(event) {
    entriesService.completeActiveEntry();
    return { success: true };
}

module.exports = {
    handleGetActiveEntry,
    handleGetEntries,
    handleStartEntry,
    handleCompleteActiveEntry
};
