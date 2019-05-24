const fs = require('fs')

const { getGlobal } = require('electron').remote
const { ipcRenderer, remote } = require('electron')
const tf = require('@tensorflow/tfjs');

let { htmlToNetworkJSON } = require('../utils/parseLayers.js')
let { getValidLayers } = require('../utils/validateLayers.js')
let { buildNetwork } = require("../utils/tfUtils.js")

window.$ = window.jQuery = require('../jquery-3.4.1/jquery-3.4.1.js');
require('../jquery-ui-1.12.1/jquery-ui.min.js')

let layerId = 0
let model

function addLayer(type) {
    console.log("addLayer: " + layerId)

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

        let layerTypeArgument = '--layerType=' + type
        let layerIdArgument = '--layerId=' + node.getAttribute('id')
        ipcRenderer.send('additionalWindow', ["configureLayer", layerTypeArgument, layerIdArgument])
    })

    node.appendChild(configureNode)

    var deleteNode = document.createElement('button')
    deleteNode.innerHTML = "Del"
    deleteNode.addEventListener('click', () => {
        node.parentNode.removeChild(node)
        scanAndValidateLayers()
    })
    node.appendChild(deleteNode)

    let discardReasonsText = document.createElement('p')
    discardReasonsText.setAttribute('id', "discardReasons-" + node.getAttribute('id'))
    node.appendChild(discardReasonsText)

    document.getElementById("designList").appendChild(node);

    scanAndValidateLayers()
    layerId++
}

document.getElementById('dense').onclick = () => addLayer("Dense")

document.getElementById('gru').onclick = () => addLayer("GRU")

document.getElementById('lstm').onclick = () => addLayer("LSTM")

function colorValidatedLayers(layers) {

    for (layerIndex in layers.validLayers) {
        let layer = layers.validLayers[layerIndex]

        let htmlLayer = document.getElementById(layer.id)

        htmlLayer.classList.remove("red")
        htmlLayer.classList.add("green")

        document.getElementById('discardReasons-' + layer.id).innerHTML = ""
    }

    for (layerIndex in layers.invalidLayers) {
        let layer = layers.invalidLayers[layerIndex]

        let htmlLayer = document.getElementById(layer.id)
        htmlLayer.classList.remove("green")
        htmlLayer.classList.add("red")

        document.getElementById('discardReasons-' + layer.id).innerHTML = layer.discardReasons
    }
}

// Gets html from designList and transforms it to a json with the elements from the network
function scanAndValidateLayers() {
    let designList = document.getElementById('designList').innerHTML

    // CONVERT TO JSON
    let networkJSON = htmlToNetworkJSON(designList)

    validatedLayers = getValidLayers(networkJSON, getGlobal('sharedObj').targetVariableList.size)
    colorValidatedLayers(validatedLayers)

    console.log("VAL")
    console.log(validatedLayers.validLayers.length)
    console.log(validatedLayers.invalidLayers.length)

    if ((validatedLayers.validLayers.length != 0 && validatedLayers.invalidLayers.length == 0)) {
        document.getElementById('testModelBtn').disabled = false
        transformToCode()
    } else {
        document.getElementById('testModelBtn').disabled = true
    }

}

function transformToCode() {
    console.log("transformToCode")
    let designList = document.getElementById('designList').innerHTML
    let networkJSON = htmlToNetworkJSON(designList)

    model = buildNetwork(networkJSON, getGlobal('sharedObj').predictiveVariableList.size)

    getGlobal('sharedObj').model = model
}

document.getElementById('generateCode').onclick = () => transformToCode()

function testModel() {
    const xs = tf.randomNormal([100, getGlobal('sharedObj').predictiveVariableList.size]);
    const ys = tf.randomNormal([100, getGlobal('sharedObj').targetVariableList.size]);

    if (model) {
        model.fit(xs, ys, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
            }
        });
    }
}

document.getElementById('testModelBtn').onclick = () => testModel()

ipcRenderer.on('configureLayer', (event, response) => {
    console.log("configureLayer:")

    let configuratedLayerId = response['layerId']
    for (key in response) {
        console.log("KEY: " + key + " VALUE: " + response[key])

        if (key !== 'layerId') {
            document.getElementById(configuratedLayerId).setAttribute(key, response[key])
        }
    }
    scanAndValidateLayers()
})

// Called when the window will show so it can revalidate the layers
ipcRenderer.on('will-show', (event, message) => {
    console.log("will-show: ", message)
    scanAndValidateLayers()
})

$(document).ready(function() {
    $(init);

    function init() {
        $(".droppable-area1, .droppable-area2").sortable({
            connectWith: ".connected-sortable",
            stack: '.connected-sortable ul',
            stop: () => {
                scanAndValidateLayers()
            }
        }).disableSelection();
    }
})