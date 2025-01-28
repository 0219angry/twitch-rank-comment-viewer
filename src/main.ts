import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import tmi from 'tmi.js';

// window instance
let commentWindow: BrowserWindow | null;
let settingWindow: BrowserWindow | null;

// settings
let channelName: string = 'fps_shaka'; // 対象のチャンネル名

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
  settingWindow.webContents.openDevTools({mode: 'detach'});
}

// 起動時にコメントビュワーを表示する
app.once('ready', () => {
  let client: tmi.Client | null = null;
  const createtmiClient = async(channel: string) => {
    // 既にあるクライアントを削除
    if( client ) {
      console.log(`[INFO] disconnected from ${client.getChannels()[0]}`)
      await client.disconnect().catch(err => {
        console.error('[ERROR] Failed to disconnect:', err);
      });
    }
    // tmiの設定
    client = new tmi.Client({
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

    await client.connect();
    console.log(`[INFO] connected to ${client.getChannels()[0]}`);
  }

  createtmiClient(channelName);

  createCommentWindow();
  createSettingWindow();

  ipcMain.handle('set-channel', (_event, newChannelName: string) => {
    channelName = newChannelName;
    createtmiClient(channelName);
    return { success:true, message: 'Channel changed successfully' }
  })
});

// 全てのwindowが閉じられたときアプリケーションを修了
app.once('window-all-closed', () => {
  app.quit();
});



