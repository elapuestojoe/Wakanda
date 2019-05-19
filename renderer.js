// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')
var app = require('electron').remote
var dialog = app.dialog
var fs = require('fs')

// Send message to main process on channel1
// ipcRenderer.send('channel1', 'Hello from renderer process')
// ipcRenderer.on('channel1', (e, args) => {
//   console.log(args)
// })
// ipcRenderer.on('private', (e, args) => {
//   console.log(args)
// })

document.getElementById('openButton').onclick = () => {
  dialog.showOpenDialog({
    // Set custom filters
    // properties: ['openFile'],
    // filters: [{
    //   name: 'Images',
    //   extensions: ['jpg', 'jpeg', 'png']
    // }]
  }, (fileNames) => {
    if (fileNames === undefined) {
      alert("No file selected")
    } else {
      readFile(fileNames[0])
    }
  })
}

function readFile(filepath) {
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      alert('An error occured reading the file.')
      return
    }
    var textArea = document.getElementById('output')
    textArea.value = data
  })
}

document.getElementById('visualizeSection').onclick = () => {
  console.log("Visualize button clicked")
  document.getElementById('mainContent').innerHTML = '<object type="text/html" data="designNetwork.html"></object>'
}