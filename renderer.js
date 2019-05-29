// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')
const session = require('electron').remote.session;

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

ipcRenderer.on('inputDataLoaded', (event, flag) => {
    if (flag) {
        document.getElementById('loadDataSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    }
});

ipcRenderer.on('scanAndValidateLayers', (event, flag) => {
    if (flag) {
        document.getElementById('designSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    } else {
        document.getElementById('designSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    }
});