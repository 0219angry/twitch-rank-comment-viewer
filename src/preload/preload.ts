import { contextBridge, ipcRenderer, ipcMain } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  initialize: (callback: () => void) => {
    ipcRenderer.on('initialize', (_event) => {
      callback();
    });
  },
  // メインプロセスから受け取ったチャットメッセージをレンダラープロセスに渡す
  onNewComment: (callback: (data: { user: string, message: string }) => void) => {
    ipcRenderer.on('new-comment', (_event, data) => {
      callback(data);
    });
  },

  onSetChannel: (channelName: string) => {
    ipcRenderer.invoke('set-channel', channelName)
  }
});