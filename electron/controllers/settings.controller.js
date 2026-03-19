const settingsService = require('../services/settings.service');

async function handleGetSettings(event) {
    return settingsService.getSettings();
}

async function handleUpdateSettings(event, startTime, breakTime, endTime) {
    if (!startTime || !breakTime || !endTime) {
        throw new Error('Todos los campos de hora son requeridos');
    }
    return settingsService.updateSettings(startTime, breakTime, endTime);
}

module.exports = {
    handleGetSettings,
    handleUpdateSettings
};
