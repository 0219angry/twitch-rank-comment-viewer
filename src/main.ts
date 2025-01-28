import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import tmi from 'tmi.js';

// window instance
let commentWindow: BrowserWindow | null;
let settingWindow: BrowserWindow | null;

// settings
let channelName: string = 'twitch'; // 対象のチャンネル名

// BrowserWindowのインスタンス生成
const createCommentWindow = () => {
  commentWindow = new BrowserWindow({
    width: 320,
    height: 480,
    x: 20,
    y: 20,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload/preload.js'),
    }
  });
  
  commentWindow.loadFile(path.join(__dirname, 'comment/comment.html'));
  commentWindow.menuBarVisible = false;

  // devtools
  commentWindow.webContents.openDevTools({mode: 'detach'});
  commentWindow.webContents.send('initialize');
};

const createSettingWindow = () => {
  settingWindow = new BrowserWindow({
    width: 320,
    height: 480,
    x: 20,
    y: 520,
    webPreferences: {
      preload: path.join(__dirname, 'preload/preload.js'),
      contextIsolation: true,
    }
  });
  settingWindow.loadFile(path.join(__dirname, 'setting/setting.html'));
}

// 起動時にコメントビュワーを表示する
app.once('ready', () => {
  createCommentWindow();
  createSettingWindow();
  // tmiの設定
  const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true, secure: true },
    channels: [channelName],
  });

  client.on('message', (channel, tags, message) => {
    if(commentWindow) {
      commentWindow.webContents.send('new-comment', {
        user: tags['display-name'],
        message,
      });
    }
  });

  client.connect()
});

// 全てのwindowが閉じられたときアプリケーションを修了
app.once('window-all-closed', () => {
  app.quit();
});



