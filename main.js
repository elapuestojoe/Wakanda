// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, Menu, MenuItem, ipcMain } = require('electron');
const url = require('url')
const path = require('path')
global.__basedir = __dirname;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

require('electron-reload')(__dirname);

// Create app menu
let mainMenu = new Menu.buildFromTemplate(require('./mainMenu.js'))
    // Save window state
const windowStateKeeper = require('electron-window-state')

let mainWindow
let configureLayerWindow

let dictWindows = {}
global.sharedObj = {
    trainFilePath: null,
    predictiveVariableList: new Set(),
    targetVariableList: new Set(),
    orderedHeaders: [],
    modelHTML: null,
    scanAndValidateLayers: false
};

let currentURL;

function createWindow() {
    // Create the browser window.
    let winState = windowStateKeeper({
        defaultWidth: 1200,
        defaultHeight: 800
    });

    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        x: winState.x,
        y: winState.y,
        minWidth: 800,
        minHeight: 800,
        // backgroundColor: '#9E9E9E',
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
    winState.manage(mainWindow);

    // and load the index.html of the app.
    // mainWindow.loadFile('html/sideBar.html');
    // mainWindow.loadFile('html/mainWindow.html');
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.webContents.openDevTools(true);

    // dictWindows["html/loadData.html"] = new BrowserView({
    //     webPreferences: {
    //         nodeIntegration: true
    //     }
    // });

    // dictWindows["html/loadData.html"].setBounds({ x: 160, y: 0, width: mainWindow.getBounds().width - 160 - 300, height: mainWindow.getBounds().height })
    // dictWindows["html/loadData.html"].setAutoResize({ width: true, height: true })
    // dictWindows["html/loadData.html"].webContents.loadFile('html/loadData.html')
    // mainWindow.setBrowserView(dictWindows["html/loadData.html"])
    // dictWindows["html/loadData.html"].webContents.openDevTools()

    // currentURL = "html/loadData.html"
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    Menu.setApplicationMenu(mainMenu)
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('before-quit', function() {
    // Called before quitting, it might be useful to save app current state
    console.log("App is about to quit")
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// IPC management

ipcMain.on('inputDataChanged', (event, flag) => {
    if (dictWindows['html/designNetwork.html']) {
        dictWindows['html/designNetwork.html'].webContents.send('inputDataChanged', flag);
    }
});

ipcMain.on('inputDataLoaded', (event, flag) => {
    mainWindow.webContents.send('inputDataLoaded', flag);
});

ipcMain.on('scanAndValidateLayers', (event, flag) => {
    global.sharedObj.scanAndValidateLayers = flag;
    mainWindow.webContents.send('scanAndValidateLayers', flag);
});

ipcMain.on('updateWebView', (e, url) => {

    if (url === currentURL) {
        return
    }
    currentURL = url

    if (dictWindows[url]) {

        mainWindow.setBrowserView(dictWindows[url])

        dictWindows[url].webContents.send('will-show', url)

    } else {
        dictWindows[url] = new BrowserView({
            webPreferences: {
                nodeIntegration: true
            }
        })

        dictWindows[url].setBounds({ x: 160, y: 0, width: mainWindow.getBounds().width - 160 - 300, height: mainWindow.getBounds().height })
        dictWindows[url].setAutoResize({ width: true, height: true })
        dictWindows[url].webContents.loadFile(url)
        mainWindow.setBrowserView(dictWindows[url])
        dictWindows[url].webContents.openDevTools()
    }

    if (url !== 'html/designNetwork.html' && configureLayerWindow) {
        configureLayerWindow.close()
    }
})

ipcMain.on('configureLayer', (event, response) => {
    console.log("configureLayer")
    dictWindows['html/designNetwork.html'].webContents.send('configureLayer', response)
})

ipcMain.on('additionalWindow', (event, args) => {
    if (args[0] === 'configureLayer') {

        if (configureLayerWindow) {
            configureLayerWindow.close()
        }
        configureLayerWindow = new BrowserWindow({
            width: 800,
            height: 400,
            modal: true,
            parent: BrowserWindow.getFocusedWindow,
            webPreferences: {
                nodeIntegration: true,
                additionalArguments: [args[1], args[2]]
            },
            show: false
        })
        configureLayerWindow.on('ready-to-show', () => {
            configureLayerWindow.show()
        })

        configureLayerWindow.on('close', () => {
            configureLayerWindow = null
        })
        configureLayerWindow.loadFile('html/configureLayer.html')
        configureLayerWindow.webContents.openDevTools()


    }
})