const tf = require('@tensorflow/tfjs');
let { buildNetwork } = require("./tfUtils.js")

let network = [
    { class: "draggable-item", id: 0, type: "Dense", units: "100" },
    { class: "draggable-item", id: 1, type: "Dense", units: "100" },
    { class: "draggable-item", id: 2, type: "Dense", units: "1" },
]

let model = buildNetwork(network, 10)

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
    }
});