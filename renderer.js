const electron = require('electron')
onload = () => {
    const webview = document.getElementById('webview');
    webview.addEventListener('new-window', (e) => {
        electron.shell.openExternal(e.url);
    });
}

const {ipcRenderer} = require('electron');

const ElectronSearchText = require('electron-search-text');
const searcher = new ElectronSearchText({
  target: '#webview',
  input: '.search-input',
  count: '.search-count',
  box: '.search-box',
  visibleClass: '.state-visible'
});

ipcRenderer.on('toggleSearch', function() {
  searcher.emit('toggle');
  if (searcher.$searchBox.className == 'search-box state-visible') {
    console.log(searcher);
  }
});
