let requirements = {
    'Dense': ['units', 'activation'],
    "GRU": ['units', 'activation'],
    "LSTM": ['units', 'activation']
}

function getValidLayers(layerArray, output_shape) {

    result = {
        validLayers: [],
        invalidLayers: []
    }

    for (layerId in layerArray) {
        let layer = layerArray[layerId]

        let discardReasons = []
        let discard = false

        let layerRequirements = requirements[layer.type]

        for (requirementId in layerRequirements) {
            let requirement = layerRequirements[requirementId]

            if (!layer[requirement]) {
                discard = true
                discardReasons.push('Layer must have ' + requirement)
            }
        }

        if (layerId == layerArray.length - 1) {

            if (!output_shape) {
                discard = true
                discardReasons.push("You haven't defined your target data!")
            } else if (!layer.units || output_shape != layer.units) {
                discard = true
                discardReasons.push("Output layer's units must match output shape (" + output_shape + ")")
            }


        }

        if (discard) {
            layer.discardReasons = discardReasons
            result.invalidLayers.push(layer)
        } else {
            layer.discardReasons = []
            result.validLayers.push(layer)
        }
    }

    return result
}

module.exports = {
    getValidLayers: getValidLayers
}