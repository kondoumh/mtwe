const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const Menu = electron.Menu

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 900 })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mobile.html'),
        protocol: 'file:',
        slashes: true
    }))

    initWindowMenu()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})

function initWindowMenu() {

    const template = [{
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                {
                    label: 'Mobile Twitter',
                    click: function(item, window) {
                        window.loadURL(url.format({
                            pathname: path.join(__dirname, 'mobile.html'),
                            protocol: 'file:',
                            slashes: true
                        }))
                    }
                },
                {
                    label: 'Desktop Twitter',
                    click: function(item, window) {
                        window.loadURL(url.format({
                            pathname: path.join(__dirname, 'desktop.html'),
                            protocol: 'file:',
                            slashes: true
                        }))
                    }
                }
            ]
        }
    ]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        })

    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
