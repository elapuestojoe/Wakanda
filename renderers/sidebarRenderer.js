const {ipcRenderer} = require('electron')
document.getElementById('networkArchitectureSection').onclick = () => {
    ipcRenderer.send('channel1', "DesignNetwork")
  }