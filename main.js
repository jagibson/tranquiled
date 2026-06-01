const { app, BrowserWindow, globalShortcut, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

const useAllDisplays = false;
let windows = [];
let tray = null;

let settings = {
    initialInterval: 100,   // ms per half-cycle at start
    slowdownTime: 60,       // seconds to reach 1/second
    steadyTime: 120         // seconds at 1/second before fade-out
};

function createTrayIcon() {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'tray-icon.png'));
    tray = new Tray(icon.resize({ width: 16, height: 16 }));
    tray.setToolTip('TranquiLED');
    updateTrayMenu();
}

function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        { label: 'TranquiLED', enabled: false },
        { type: 'separator' },
        { label: 'Initial Blink Rate', enabled: false },
        {
            label: '10/sec (very fast)',
            type: 'radio',
            checked: settings.initialInterval === 50,
            click: () => updateSetting('initialInterval', 50)
        },
        {
            label: '5/sec (fast)',
            type: 'radio',
            checked: settings.initialInterval === 100,
            click: () => updateSetting('initialInterval', 100)
        },
        {
            label: '3/sec (moderate)',
            type: 'radio',
            checked: settings.initialInterval === 167,
            click: () => updateSetting('initialInterval', 167)
        },
        { type: 'separator' },
        { label: 'Slowdown Time', enabled: false },
        {
            label: '30 seconds',
            type: 'radio',
            checked: settings.slowdownTime === 30,
            click: () => updateSetting('slowdownTime', 30)
        },
        {
            label: '1 minute',
            type: 'radio',
            checked: settings.slowdownTime === 60,
            click: () => updateSetting('slowdownTime', 60)
        },
        {
            label: '2 minutes',
            type: 'radio',
            checked: settings.slowdownTime === 120,
            click: () => updateSetting('slowdownTime', 120)
        },
        {
            label: '5 minutes',
            type: 'radio',
            checked: settings.slowdownTime === 300,
            click: () => updateSetting('slowdownTime', 300)
        },
        { type: 'separator' },
        { label: 'Steady Time Before Fade', enabled: false },
        {
            label: '1 minute',
            type: 'radio',
            checked: settings.steadyTime === 60,
            click: () => updateSetting('steadyTime', 60)
        },
        {
            label: '2 minutes',
            type: 'radio',
            checked: settings.steadyTime === 120,
            click: () => updateSetting('steadyTime', 120)
        },
        {
            label: '5 minutes',
            type: 'radio',
            checked: settings.steadyTime === 300,
            click: () => updateSetting('steadyTime', 300)
        },
        {
            label: 'Never (keep blinking)',
            type: 'radio',
            checked: settings.steadyTime === Infinity,
            click: () => updateSetting('steadyTime', Infinity)
        },
        { type: 'separator' },
        {
            label: 'Restart',
            click: () => sendToAll('restart-heartbeat')
        },
        {
            label: 'Toggle (Ctrl+Shift+L)',
            click: () => sendToAll('toggle-led')
        },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setContextMenu(contextMenu);
}

function updateSetting(key, value) {
    settings[key] = value;
    updateTrayMenu();
    sendToAll('update-settings', settings);
}

function sendToAll(channel, data) {
    windows.forEach(win => {
        if (!win.isDestroyed()) {
            if (data !== undefined) {
                win.webContents.send(channel, data);
            } else {
                win.webContents.send(channel);
            }
        }
    });
}

function createWindow(display) {
    const { width, height, x, y } = display.bounds;

    let win = new BrowserWindow({
        width: 100,
        height: 100,
        x: x + width - 110,
        y: y + height - 110,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setIgnoreMouseEvents(true);
    windows.push(win);

    win.on('closed', () => {
        windows = windows.filter(w => w !== win);
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('update-settings', settings);
    });
}

app.whenReady().then(() => {
    createTrayIcon();

    if (useAllDisplays) {
        const displays = screen.getAllDisplays();
        displays.forEach(display => createWindow(display));
    } else {
        createWindow(screen.getPrimaryDisplay());
    }

    globalShortcut.register('Ctrl+Shift+L', () => {
        sendToAll('toggle-led');
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            if (useAllDisplays) {
                const displays = screen.getAllDisplays();
                displays.forEach(display => createWindow(display));
            } else {
                createWindow(screen.getPrimaryDisplay());
            }
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
