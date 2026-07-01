import { app, BrowserWindow } from 'electron';
import { exec } from 'child_process';

let mainWindow;
let backendProcess;

const serverLocation = "backend/server.js";
const serverHost = "http://localhost:3000";

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: false } });
    setTimeout(() => {
        mainWindow.loadURL(serverHost);
    }, 1000);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    backendProcess = exec('node ' + serverLocation, (err, stdout, stderr) => {
        if (err) console.error({ err, stdout, stderr });
    });
    createWindow();
});

app.on('window-all-closed', () => {
    if (backendProcess) backendProcess.kill();
    if (process.platform !== 'darwin') app.quit();
});