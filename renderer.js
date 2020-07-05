const { electron, shell, clipboard } = require("electron");

const webview = document.querySelector("#webview");
const container = document.querySelector("#main");
const contextMenu = require("electron-context-menu");

let refreshIntervalId;

onload = () => {
  webview.addEventListener("new-window", e => {
    shell.openExternal(e.url);
  });

  const ari = document.querySelector("#ari");
  ari.addEventListener("click", () => {
    ipcRenderer.send("toggleAr");
  });
  indicateAutoRefresh(false);
};

webview.addEventListener("dom-ready", () => {
  contextMenu({
    window: webview,
    prepend: (actions, params, webview) => [
      {
        label: "Open with browser",
        click: () => { shell.openExternal(params.linkURL); },
        visible: params.linkURL && (params.mediaType === "none" || params.mediaType === "image")
      }
    ]
  });
});

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

ipcRenderer.on("autoRefresh", (sender, on) => {
  if (on) {
    refreshIntervalId = setInterval(clickHome, 15000);
    indicateAutoRefresh(true);
  } else {
    clearInterval(refreshIntervalId);
    indicateAutoRefresh(false);
  }
});

function clickHome() {
  webview.executeJavaScript(
    (function(){
      if (document.querySelector("h1[aria-level]").innerHTML === "ホームタイムライン") {
        document.querySelector("a[data-testid]").click();
        console.log("refreshing");
      }
    }).toString().replace(/function\s*\(\)\{/, "").replace(/}$/,"").trim()
  );
}

function indicateAutoRefresh(autoRefresh) {
  ari = document.querySelector("#ari");
  if (autoRefresh) {
    ari.title = "Timeline auto-refresh : on";
    ari.style.backgroundColor = "aquamarine";
  } else {
    ari.title = "Timeline auto-refresh : off";
    ari.style.backgroundColor = "antiquewhite";
  }
}

ipcRenderer.on("disablePopup", () => {
  clipboard.writeText("document.removeEventListener('mouseover', getEventListeners(document).mouseover[0].listener);");
  alert("Code to disable copied. Open devtools for WebView and paste to console.");
});
