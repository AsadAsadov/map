const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mapLeads', {
  search: (payload) => ipcRenderer.invoke('search-businesses', payload),
  cancelSearch: () => ipcRenderer.invoke('cancel-search'),
  exportResults: (payload) => ipcRenderer.invoke('export-results', payload),
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('search-progress', listener);
    return () => ipcRenderer.removeListener('search-progress', listener);
  }
});
