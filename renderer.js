// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')
const { app, dialog } = require('electron').remote
const session = require('electron').remote.session;
var csvHeaders = require('csv-headers');
var fs = require('fs')

session.defaultSession.cookies.get({ name: "trainFilePath" }, (error, cookies) => {
    if (error) {
        console.log("Error retrieving cookie")
    } else if (cookies.length > 0) {
        readFile(cookies[0].value)
        console.log("Retrieved cookie with value" + cookies[0].value)
    }
})

document.getElementById('loadDataSidenav').onclick = () => {
    ipcRenderer.send('updateWebView', 'html/loadData.html')
}

document.getElementById('visualizeSidenav').onclick = () => {
    ipcRenderer.send('updateWebView', 'html/visualizeData.html')
}

document.getElementById('designSidenav').onclick = () => {
    ipcRenderer.send('updateWebView', 'html/designNetwork.html')
}

document.getElementById('resultsNavBtn').onclick = () => {
    ipcRenderer.send('updateWebView', 'html/results.html')
}