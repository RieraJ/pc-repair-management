'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupDatabase } = require('./db.cjs');

// --- ARREGLO PARA LINUX ---
if (process.platform === 'linux') {
    app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
    app.commandLine.appendSwitch('no-sandbox');
    app.commandLine.appendSwitch('disable-setuid-sandbox');
}

let mainWindow;
let db;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 800,
        minHeight: 600,
        title: 'Gestión de Reparaciones',
        icon: path.join(__dirname, '../build/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    mainWindow.setMenuBarVisibility(false);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html');
        mainWindow.loadFile(indexPath).catch(err => console.error('Error loading index.html:', err));
    }
}

app.whenReady().then(() => {
    try {
        db = setupDatabase();
    } catch (err) {
        console.error('FATAL: Cannot setup database:', err);
        app.quit();
        return;
    }

    // IPC handlers
    ipcMain.handle('get-reparaciones', () =>
        db.prepare('SELECT * FROM reparaciones ORDER BY created_at ASC').all()
    );

    ipcMain.handle('add-reparacion', (_ev, reparacion) => {
        const info = db.prepare(`
            INSERT INTO reparaciones (modelo, duenio, telefono, sintoma, observacion, tratamiento, estado)
            VALUES (@modelo, @duenio, @telefono, @sintoma, @observacion, @tratamiento, @estado)
        `).run(reparacion);
        return db.prepare('SELECT * FROM reparaciones WHERE id = ?').get(info.lastInsertRowid);
    });

    ipcMain.handle('update-reparacion', (_ev, id, data) => {
        const setClause = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        db.prepare(`UPDATE reparaciones SET ${setClause} WHERE id = @id`).run({ ...data, id });
        return true;
    });

    ipcMain.handle('delete-reparacion', (_ev, id) => {
        db.prepare('DELETE FROM reparaciones WHERE id = ?').run(id);
        return true;
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}).catch(err => {
    console.error('FATAL: app.whenReady rejected:', err);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
