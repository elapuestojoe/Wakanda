const { ipcRenderer } = require('electron')

let layerType
let layerId

function processWindowArguments() {
    for (argvId in window.process.argv) {
        arg = window.process.argv[argvId]

        // Get layer type
        if (arg.length > 12 && arg.slice(0, 12) === '--layerType=') {
            layerType = arg.slice(12)

            // Get layer id
        } else if (arg.length > 10 && arg.slice(0, 10) === '--layerId=') {
            layerId = arg.slice(10)
        }
    }
}

function setUpLayerType() {
    document.getElementById('layerTypeTitle').innerHTML = "Configure layer: " + layerType
}

processWindowArguments()
setUpLayerType()

let submitFormButton = document.querySelector('#configureLayerForm')

submitFormButton.addEventListener('submit', (event) => {
    event.preventDefault()
    let response = { layerId: layerId }

    let formNode = document.getElementById('configureLayerForm')
    for (nodeID in formNode.childNodes) {
        let node = formNode.childNodes[nodeID]

        if (node.value) {
            response[node.id] = node.value
        }
    }
    ipcRenderer.send('configureLayer', response)
    window.close()
})