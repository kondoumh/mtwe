// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')
onload = () => {
    const webview = document.getElementById('webview');
    webview.addEventListener('new-window', function (e) {
        electron.shell.openExternal(e.url);
    });
}
