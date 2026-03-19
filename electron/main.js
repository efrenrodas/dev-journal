const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const entriesController = require('./controllers/entries.controller');
const settingsController = require('./controllers/settings.controller');
const cronController = require('./controllers/cron.controller');
const cronService = require('./services/cron.service');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function showMainWindow() {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
}

function hideMainWindow() {
    if (!mainWindow) return;
    mainWindow.hide();
}

function toggleMainWindow() {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
        hideMainWindow();
        return;
    }
    showMainWindow();
}

function openReportsView() {
    showMainWindow();
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('open-reports');
    }
}

function openActivitiesView() {
    showMainWindow();
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('show-activities');
    }
}

function openSettingsView() {
    showMainWindow();
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('open-settings');
    }
}

function createTrayIcon() {
    const traySvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <rect x="2" y="2" width="12" height="12" rx="3" fill="#2563eb"/>
        <rect x="4.5" y="4.5" width="7" height="2" rx="1" fill="#ffffff"/>
        <rect x="4.5" y="7.5" width="7" height="2" rx="1" fill="#ffffff"/>
        <rect x="4.5" y="10.5" width="4" height="2" rx="1" fill="#ffffff"/>
      </svg>
    `.trim();

    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(traySvg).toString('base64')}`;
    return nativeImage.createFromDataURL(dataUrl).resize({ width: 16, height: 16 });
}

function buildTrayMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Mostrar ventana',
            click: () => showMainWindow()
        },
        {
            label: 'Ocultar ventana',
            click: () => hideMainWindow()
        },
        { type: 'separator' },
        {
            label: 'Salir',
            click: () => app.quit()
        }
    ]);
}

function createTray() {
    if (tray) return;

    tray = new Tray(createTrayIcon());
    tray.setToolTip('Dev Journal');
    tray.setContextMenu(buildTrayMenu());

    tray.on('click', () => {
        toggleMainWindow();
    });
}

function buildMenu() {
    const template = [
        {
            label: 'Aplicacion',
            submenu: [
                {
                    label: 'Ver actividades',
                    click: () => openActivitiesView()
                },
                {
                    label: 'Ver reporte',
                    click: () => openReportsView()
                },
                {
                    label: 'Configuración',
                    click: () => openSettingsView()
                },
                { type: 'separator' },
                {
                    label: 'Mostrar ventana',
                    click: () => showMainWindow()
                },
                {
                    label: 'Ocultar ventana',
                    click: () => {
                        if (mainWindow) mainWindow.hide();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    if (devServerUrl) {
        mainWindow.loadURL(devServerUrl);
    } else {
        mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
    
    // Iniciar el cron pasándole la ventana principal
    cronService.init(mainWindow);
}

app.whenReady().then(() => {
    buildMenu();
    createTray();

    // --- Configuración de Controladores (IPC handlers) ---
    ipcMain.handle('get-active-entry', entriesController.handleGetActiveEntry);
    ipcMain.handle('get-entries', (event, timeframe) => entriesController.handleGetEntries(event, timeframe));
    ipcMain.handle('start-entry', (event, text) => entriesController.handleStartEntry(event, text));
    ipcMain.handle('complete-active-entry', entriesController.handleCompleteActiveEntry);
    
    // --- Settings ---
    ipcMain.handle('get-settings', settingsController.handleGetSettings);
    ipcMain.handle('update-settings', (event, startTime, breakTime, endTime) => {
        return settingsController.handleUpdateSettings(event, startTime, breakTime, endTime);
    });

    // --- Cron / Temporizador ---
    ipcMain.handle('snooze', cronController.handleSnooze);
    ipcMain.handle('reset-cron', cronController.handleResetTimer);
    ipcMain.handle('get-cron-status', cronController.handleGetStatus);
    ipcMain.handle('hide-window', cronController.handleHideWindow);

    createWindow();

    app.on('activate', () => {
        if (!mainWindow) {
            createWindow();
            return;
        }
        showMainWindow();
    });
});

app.on('before-quit', () => {
    isQuitting = true;
    if (tray) {
        tray.destroy();
        tray = null;
    }
});