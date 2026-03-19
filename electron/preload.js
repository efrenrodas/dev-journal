const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    save: (data) => {
        console.log("saving");
    },
    
    // --- Entries ---
    getActiveEntry: () => ipcRenderer.invoke('get-active-entry'),
    getEntries: (timeframe) => ipcRenderer.invoke('get-entries', timeframe),
    startEntry: (text) => ipcRenderer.invoke('start-entry', text),
    completeActiveEntry: () => ipcRenderer.invoke('complete-active-entry'),
    
    // --- Settings ---
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateSettings: (startTime, breakTime, endTime) => ipcRenderer.invoke('update-settings', startTime, breakTime, endTime),

    // --- Cron ---
    snooze: (minutes) => ipcRenderer.invoke('snooze', minutes),
    resetCron: () => ipcRenderer.invoke('reset-cron'),
    getCronStatus: () => ipcRenderer.invoke('get-cron-status'),
    hideWindow: () => ipcRenderer.invoke('hide-window'), // Exponer la llamada para ocultar
    // Escucha eventos del backend al frontend
    onPromptActivity: (callback) => ipcRenderer.on('prompt-activity', (_event) => callback()),
    onOpenReports: (callback) => ipcRenderer.on('open-reports', (_event) => callback()),
    onShowActivities: (callback) => ipcRenderer.on('show-activities', (_event) => callback()),
    onOpenSettings: (callback) => ipcRenderer.on('open-settings', (_event) => callback())
});