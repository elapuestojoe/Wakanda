const tf = require('@tensorflow/tfjs');

function getLayer(layerJSON) {

    let layer;
    switch (layerJSON.type) {

        case 'Dense':
            console.log("Adding Dense layer");
            layer = tf.layers.dense({
                units: parseInt(layerJSON.units, 10),
                activation: layerJSON.activation
            })
            break;

        case 'GRU':
            console.log("Adding GRU layer");
            layer = tf.layers.gru({
                units: parseInt(layerJSON.units, 10),
                activation: layerJSON.activation,
                returnSequences: false
            })
            break;

        case 'LSTM':
            console.log("Adding LTM layer");
            layer = tf.layers.lstm({
                units: parseInt(layerJSON.units, 10),
                activation: layerJSON.activation
            })
            break;

        default:
            console.log("Layer type " + layerJSON.type + " not implemented yet...")
            break;
    }
    return layer
}

function buildNetwork(networkJSON, input_shape) {

    const model = tf.sequential();
    model.add(tf.layers.inputLayer({ inputShape: input_shape }))


    for (layerIndex in networkJSON) {

        let layerJSON = networkJSON[layerIndex];
        let layer = getLayer(layerJSON);

        //TODO: Handle GRU to 2-d output
        if ((layerJSON.type == "GRU" || layerJSON.type == "LSTM")) {
            console.log("ADDING RESHAPE")
            let outputShape = model.layers[model.layers.length - 1].outputShape.slice(0);
            // outputShape.push(1);
            // outputShape.push(1);
            // console.log(outputShape);
            // model.add(tf.layers.reshape({ targetShape: [outputShape] }));
            model.add(tf.layers.repeatVector({ n: 1 }));
        }

        model.add(layer);
    }
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    return model;
}

module.exports = {
    buildNetwork: buildNetwork
};