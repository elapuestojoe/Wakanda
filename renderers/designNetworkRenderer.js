const { app, BrowserWindow } = require('electron').remote
const { ipcRenderer, remote } = require('electron')

layerId = 0

function addLayer(type) {
    var node = document.createElement('li')
    node.setAttribute("class", "draggable-item")
    node.setAttribute('id', layerId)
    node.setAttribute('type', type)

    var textnode = document.createTextNode(type);
    node.appendChild(textnode);

    var configureNode = document.createElement('button')
    configureNode.setAttribute('class', 'configureBtn')
    configureNode.innerHTML = "Configure layer"
    configureNode.addEventListener('click', () => {

        configureNode.setAttribute('modified', "true")
        let layerTypeArgument = '--layerType=' + type
        let layerIdArgument = '--layerId=' + node.getAttribute('id')
        ipcRenderer.send('additionalWindow', ["configureLayer", layerTypeArgument, layerIdArgument])
    })

    node.appendChild(configureNode)

    var deleteNode = document.createElement('button')
    deleteNode.innerHTML = "Del"
    deleteNode.addEventListener('click', () => {
        node.parentNode.removeChild(node)
    })
    node.appendChild(deleteNode)

    document.getElementById("designList").appendChild(node);
    layerId++
}

document.getElementById('dense').onclick = () => addLayer("Dense")

document.getElementById('gru').onclick = () => addLayer("GRU")

document.getElementById('lstm').onclick = () => addLayer("LSTM")

document.getElementById('generateCode').onclick = () => {
    console.log(document.getElementById('designList'))
}

ipcRenderer.on('configureLayer', (event, response) => {
    console.log("CONF:")

    let configuratedLayerId = response['layerId']
    for (key in response) {
        console.log("KEY: " + key + " VALUE: " + response[key])

        if (key !== 'layerId') {
            document.getElementById(configuratedLayerId).setAttribute(key, response[key])
        }
    }
})