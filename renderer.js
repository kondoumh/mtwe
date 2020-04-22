const { electron, shell } = require("electron");

const webview = document.querySelector("#webview");
const container = document.querySelector("#main");
const contextMenu = require("electron-context-menu");

let refreshIntervalId;

onload = () => {
  const webview = document.querySelector("#webview");
  webview.addEventListener("new-window", e => {
    electron.shell.openExternal(e.url);
  });
  webview.addEventListener("new-window", e => {
    shell.openExternal(e.url);
  });
  const ari = document.querySelector("#ari");
  ari.addEventListener("click", () => {
    ipcRenderer.send("toggleAr");
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
  indicateAutoRefresh(false);
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
        console.log(document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-1pi2tsx.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > section > div > div > div:nth-child(1)").style.transform);
        if (document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-1pi2tsx.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > section > div > div > div:nth-child(1)").style.transform === "translateY(0px)") {
          console.log("refreshing"); document.querySelector("a[data-testid]").click();
        }
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
