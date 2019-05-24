var remote = require('electron').remote;

const { ipcRenderer } = require('electron')

let trainFilePath

function handleTrainFilePath() {
    trainFilePath = remote.getGlobal('sharedObj').trainFilePath

    if (trainFilePath) {
        document.getElementById('loadedFileTextArea').innerHTML = "Loaded file: " + trainFilePath
    }
}

handleTrainFilePath()

ipcRenderer.on('will-show', (event, message) => {
    handleTrainFilePath()
})