const { electron, shell } = require("electron");

const webview = document.querySelector("#webview");
const container = document.querySelector("#main");
const contextMenu = require("electron-context-menu");

onload = () => {
  const webview = document.querySelector("#webview");
  webview.addEventListener("new-window", e => {
    electron.shell.openExternal(e.url);
  });
  webview.addEventListener("new-window", e => {
    shell.openExternal(e.url);
  });
  contextMenu({
    window: webview,
    prepend: (actions, params, webview) => [
      {
        label: "Open with browser",
        click: () => { shell.openExternal(params.linkURL); },
        visible: params.linkURL && (params.mediaType === "none" || params.mediaType === "image")
      },
      {
        label: "Search on Google \"" + params.selectionText + "\"",
        click: () => {
          url = "https://www.google.com/search?q=" + params.selectionText;
          shell.openExternal(url);
        },
        visible: params.selectionText !== ""
      }
    ]
  });
  setInterval(clickHome, 10000);
};

const { ipcRenderer } = require("electron");

const ElectronSearchText = require("electron-search-text");
const searcher = new ElectronSearchText({
  target: "#webview",
  input: ".search-input",
  count: ".search-count",
  box: ".search-box",
  visibleClass: ".state-visible"
});

searcher.on("did-finish-hide", () => {
  container.className = "webview-container";
});

searcher.on("did-finish-show", () => {
  container.className = "webview-container-search";
});

ipcRenderer.on("toggleSearch", () => {
  searcher.emit("toggle");
});

ipcRenderer.on("goBack", () => {
  if (webview.canGoBack()) {
    webview.goBack();
  }
});

ipcRenderer.on("goForward", () => {
  if (webview.canGoForward()) {
    webview.goForward();
  }
});

ipcRenderer.on("openDevToolsForWebView", () => {
  webview.openDevTools();
});

async function clickHome() {
  await webview.executeJavaScript('document.querySelector("a[data-testid]").click();', false);
}
