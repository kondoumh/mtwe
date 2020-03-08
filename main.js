const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Store = require("electron-store");

const path = require("path");
const url = require("url");
const Menu = electron.Menu;
const openAboutWindow = require("about-window").default

let mainWindow;

const store = new Store({
  defaults: {
    bounds: {
      width: 600,
      height: 700,
    },
  },
});

const createWindow = () => {
  let {width, height, x, y} = store.get("bounds");
  const displays = electron.screen.getAllDisplays();
  const activeDisplay = displays.find((display) => {
    return display.bounds.x <= x && display.bounds.y <= y &&
      display.bounds.x + display.bounds.width >= x &&
      display.bounds.y + display.bounds.height >= y;
  });
  if (!activeDisplay) {
    x = 50; y = 10; width = 600, height = 700;
  }

  mainWindow = new BrowserWindow({
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    },
    width: width, height: height, x: x, y: y
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "desktop.html"),
      protocol: "file:",
      slashes: true
    })
  );

  ['resize', 'move'].forEach(e => {
    mainWindow.on(e, () => {
        store.set('bounds', mainWindow.getBounds());
    });
  })

  initWindowMenu();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.allowRendererProcessReuse = true;
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function initWindowMenu() {
  const template = [
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectall" },
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "go back",
          accelerator: "CmdOrCtrl+[",
          click() {
            mainWindow.webContents.send("goBack");
          }
        },
        {
          label: "go forward",
          accelerator: "CmdOrCtrl+]",
          click() {
            mainWindow.webContents.send("goForward");
          }
        },
        { role: "reload" },
        { type: "separator" },
        {
          label: "Search in window",
          accelerator: "CmdOrCtrl+F",
          click() {
            mainWindow.webContents.send("toggleSearch");
          }
        }
      ]
    }
  ];

  if (!app.isPackaged) {
    template.unshift({
      label: "Debug",
      submenu: [
        { role: "forceReload"},
        { role: "toggledevtools" },
        { 
          label: "open devTools for WebView",
          click () {
            mainWindow.webContents.send("openDevToolsForWebView");
          }
        }
      ]
    });
  }

  if (process.platform === "darwin") {
    template.unshift({
      label: app.name,
      submenu: [
        {
          label: "About mtwe",
          click() {
            showAboutWindow();
          }
        },
        { type: "separator" },
        { role: "services", submenu: [] },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    });
  } else {
    template.push({
      label: "help",
      submenu: [
        {
          label: "About mtwe",
          click() {
            showAboutWindow();
          }
        }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function showAboutWindow() {
  openAboutWindow({
    icon_path: __dirname + path.sep + "icons/png/512x512.png",
    copyright: 'Copyright (c) 2019 kondoumh',
    package_json_dir: __dirname + path.sep
  });
}
