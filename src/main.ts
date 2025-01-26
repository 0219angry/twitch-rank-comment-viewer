import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null;

// BrowserWindowのインスタンス生成
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });
  console.log(__dirname)

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};


app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => {
  app.quit();
});