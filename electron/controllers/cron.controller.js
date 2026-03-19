const cronService = require('../services/cron.service');

function handleSnooze(event, minutes) {
    cronService.snooze(minutes);
    return { success: true, snoozedFor: minutes };
}

function handleResetTimer(event) {
    cronService.resetTimer();
    return { success: true };
}

function handleGetStatus(event) {
    return cronService.getStatus();
}

function handleHideWindow(event) {
    cronService.hideWindow();
    return { success: true };
}

module.exports = {
    handleSnooze,
    handleResetTimer,
    handleGetStatus,
    handleHideWindow
};
