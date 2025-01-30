import { Api, Handler } from '@electron-nx/prerender-api';
import { contextBridge, ipcRenderer } from 'electron';

const api: Api = {
  getTransactions: (nextToken: string | null) => {
    return ipcRenderer.invoke('getTransactions', nextToken);
  },
  connectWebsocket: () => ipcRenderer.invoke('connectWebsocket'),
  disconnectWebsocket: () => ipcRenderer.invoke('disconnectWebsocket'),
  onWsConnected: (callback: (c: boolean) => void) => {
    ipcRenderer.on('wsConnected', (_event, value: boolean) => {
      callback(value);
    });
  },
  emitEvent: (event: string, payload: unknown) =>
    ipcRenderer.invoke('emitEvent', event, payload),

  registerEventHandler: async (event: string, handler: Handler) => {
    ipcRenderer.on(`__wsEvent-${event}`, (_event, ...args: unknown[]) => {
      handler(...args);
    });
  },
};
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
});
contextBridge.exposeInMainWorld('api', api);
