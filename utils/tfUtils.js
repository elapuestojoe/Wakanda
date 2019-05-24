const tf = require('@tensorflow/tfjs');

function getLayer(layerJSON, input_shape) {

    let layer;
    switch (layerJSON.type) {

        case 'Dense':
            console.log("Adding Dense layer")
            layer = tf.layers.dense({
                units: parseInt(layerJSON.units, 10),
                activation: 'relu'
            })
            break;

        default:
            console.log("Layer type " + layerJSON.type + " not implemented yet...")
            break;
    }
    return layer
}

function buildNetwork(networkJSON, input_shape) {

    console.log(networkJSON)
    const model = tf.sequential();
    model.add(tf.layers.inputLayer({ inputShape: [input_shape] }))

    for (layerIndex in networkJSON) {

        let layerJSON = networkJSON[layerIndex]

        if (layerIndex == 0) {
            model.add(getLayer(layerJSON))
        } else {
            model.add(getLayer(layerJSON))
        }

    }
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    return model
}

module.exports = {
    buildNetwork: buildNetwork
}