// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

require('electron-reload')(__dirname);


// Create app menu
let mainMenu = new Menu.buildFromTemplate(require('./mainMenu.js'))
// Save window state
const windowStateKeeper = require('electron-window-state')

let mainWindow

function createWindow() {
  // Create the browser window.
  let winState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  })

  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    minWidth: 600,
    minHeight: 800,
    backgroundColor: '#9E9E9E',
    webPreferences: {
      nodeIntegration: true
    }
  })
  winState.manage(mainWindow)

  // and load the index.html of the app.
  mainWindow.loadFile('html/index.html')

  // Send message to render
  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.send('private', 'Message from Main process to MainWindow')
  // })
  // TODO: Learn modal windows

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
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
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', function () {
  // Called before quitting, it might be useful to save app current state
  console.log("App is about to quit")
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// IPC management
// ipcMain.on('channel1', (e, args) => {
//   console.log(args)
//   if(args === 'DesignNetwork') {
//     mainWindow.loadFile('html/designNetwork.html')
//   }
// })

// Python code test
let { PythonShell } = require('python-shell')

PythonShell.run('hello.py', null, function (err, results) {
  if (err) throw err;
  console.log('finished')
  console.log(results)
});