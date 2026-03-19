const settingsService = require('./settings.service');
const entriesService = require('./entries.service');

let nextPromptTime = null;
let timerInterval = null;
let mainWindow = null;
let isPromptActive = false; // Para saber si necesitamos respuesta del usuario

function init(win) {
    mainWindow = win;
    timerInterval = setInterval(() => {
        void checkTime();
    }, 60 * 1000);
    void setInitialPromptTime();
    void checkTime();
}

async function setInitialPromptTime() {
    const settings = await settingsService.getSettings();
    if (!settings) return;

    const now = new Date();
    const [startHour, startMinute] = settings.start_time.split(':').map(Number);
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0);
    
    const activeEntry = await entriesService.getActiveEntry();

    if (now < startTime) {
        // No empieza la jornada
        nextPromptTime = startTime;
    } else {
        if (activeEntry) {
            // Si ya hay una actividad en progreso, que corra 1 hora
            nextPromptTime = new Date(now.getTime() + 60 * 60000);
        } else {
            // Horario laboral iniciado y sin actividad -> preguntar ahora
            nextPromptTime = now;
        }
    }
}

async function checkTime() {
    if (!nextPromptTime || !mainWindow) return;

    const now = new Date();
    const settings = await settingsService.getSettings();
    
    if (!settings) return;

    const [endHour, endMinute] = settings.end_time.split(':').map(Number);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, 0);

    if (now >= endTime) {
        return; // Terminó la jornada
    }

    if (now >= nextPromptTime) {
        triggerPrompt();
    }
}

function triggerPrompt() {
    isPromptActive = true; // Guardar el estado de alerta
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('prompt-activity');
    }
    nextPromptTime = null;
}

function snooze(minutes) {
    isPromptActive = false;
    const now = new Date();
    nextPromptTime = new Date(now.getTime() + minutes * 60000);
}

function resetTimer() {
    isPromptActive = false;
    snooze(60);
}

// Nueva función para esconder la ventana después de la selección
function hideWindow() {
    if (mainWindow) {
        mainWindow.hide();
    }
}

async function getStatus() {
    await checkTime(); // Forzar check por si lo piden justo antes del setInterval
    return { isPromptActive };
}

module.exports = {
    init,
    snooze,
    resetTimer,
    getStatus,
    hideWindow
};
