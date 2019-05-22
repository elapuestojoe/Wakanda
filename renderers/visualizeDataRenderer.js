var remote = require('electron').remote;
const session = require('electron').remote.session;
const { ipcRenderer } = require('electron')

function handleTrainFilePath() {
    let trainFilePath = remote.getGlobal('sharedObj').trainFilePath

    console.log("VIZ")
    console.log(trainFilePath)
}

handleTrainFilePath()

ipcRenderer.on('trainFilePath', (event, data) => {
    console.log("UPDATED")
    console.log(data.msg)
})