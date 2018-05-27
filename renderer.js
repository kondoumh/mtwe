const electron = require('electron')
onload = () => {
    const webview = document.getElementById('webview');
    webview.addEventListener('new-window', (e) => {
        electron.shell.openExternal(e.url);
    });
}
