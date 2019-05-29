const fs = require('fs');

const { dialog, getGlobal } = require('electron').remote;
var remote = require('electron').remote;
const { ipcRenderer } = require('electron');

let Papa = require('papaparse');
const tf = require('@tensorflow/tfjs');

let { trainTestSplit } = require('../utils/preprocessing.js');
let { htmlToNetworkJSON } = require('../utils/parseLayers.js')
let { buildNetwork } = require("../utils/tfUtils.js")

Papa.SCRIPT_PATH = '../node_modules/papaparse/papaparse.js'

let testFilePath

function getHeaders(filepath) {
    Papa.parse(filepath, {
        worker: true,
        header: true,
        download: true,
        dynamicTyping: true,
        preview: 1,
        complete: function(results) {

            let testHeaders = new Set(results.meta.fields);

            validatedHeaders = validateHeaders(testHeaders);

            console.log(validatedHeaders);
        }
    });
}

function validateHeaders(testHeaders) {

    let valid = true;
    let invalidReasons = [];

    let predictiveVariableSet = remote.getGlobal('sharedObj').predictiveVariableList;
    let targetVariableSet = remote.getGlobal('sharedObj').targetVariableList;

    predictiveVariableSet.forEach((element) => {

        if (!testHeaders.has(element)) {
            valid = false;
            invalidReasons.push("Test set doesn't have column '" + element + "', used as predictive variable");
        }
    });

    targetVariableSet.forEach((element) => {
        if (!testHeaders.has(element)) {
            valid = false;
            invalidReasons.push("Test set doesn't have column '" + element + "', used as target variable");
        }
    });

    return { valid: valid, invalidReasons: invalidReasons };
}

function loadContents() {

    let trainFilePath = remote.getGlobal('sharedObj').trainFilePath;

    let networkDesigned = remote.getGlobal('sharedObj').scanAndValidateLayers;

    // DEBUG
    // trainFilePath = "s";
    // networkDesigned = true;

    if (trainFilePath && networkDesigned) {

        document.getElementById('requirementsFulfilled').setAttribute('class', 'show');
        document.getElementById('loadedDataText').setAttribute('class', 'hidden');
        document.getElementById('networkDesignedText').setAttribute('class', 'hidden');

    } else {
        document.getElementById('requirementsFulfilled').setAttribute('class', 'hidden');
        if (!trainFilePath) {
            document.getElementById('loadedDataText').setAttribute('class', 'show');
        } else {
            document.getElementById('loadedDataText').setAttribute('class', 'hidden');
        }

        if (!networkDesigned) {
            document.getElementById('networkDesignedText').setAttribute('class', 'show');
        } else {
            document.getElementById('networkDesignedText').setAttribute('class', 'hidden');
        }
    }
}

ipcRenderer.on('will-show', (event, message) => {
    loadContents();
});

loadContents();

document.getElementById('splitTrainFile').addEventListener('change', (event) => {

    if (event.target.checked) {
        if (document.getElementById('supplyTestFile').checked) {
            document.getElementById('supplyTestFile').checked = false;
        }

        document.getElementById('splitTrainRequirements').setAttribute('class', 'show');
        document.getElementById('supplyTestFileRequirements').setAttribute('class', 'hidden');
    } else {
        document.getElementById('splitTrainRequirements').setAttribute('class', 'hidden');
    }
})

document.getElementById('supplyTestFile').addEventListener('change', (event) => {

    if (event.target.checked) {
        if (document.getElementById('splitTrainFile').checked) {
            document.getElementById('splitTrainFile').checked = false;
        }

        document.getElementById('supplyTestFileRequirements').setAttribute('class', 'show');
        document.getElementById('splitTrainRequirements').setAttribute('class', 'hidden');
    } else {
        document.getElementById('supplyTestFileRequirements').setAttribute('class', 'hidden');
    }
})

document.getElementById('trainSplit').addEventListener('input', (event) => {

    let trainSplitVal = parseInt(event.target.value, 10);

    document.getElementById('testSplit').value = 100 - trainSplitVal;
});

document.getElementById('testSplit').addEventListener('input', (event) => {

    let testSplitVal = parseInt(event.target.value, 10);

    document.getElementById('trainSplit').value = 100 - testSplitVal;
});

document.getElementById('supplyTestFileButton').addEventListener('click', (event) => {
    dialog.showOpenDialog({
        // Set custom filters
        properties: ['openFile'],
        filters: [{
            name: 'CSV files',
            extensions: ['csv']
        }]
    }, (fileNames) => {
        if (fileNames === undefined) {
            alert("No file selected");
        } else {
            testFilePath = fileNames[0];

            document.getElementById('supplyTestFileText').innerHTML = "Test filepath: " + testFilePath;

            getHeaders(testFilePath)
        }
    })
});

document.getElementById('trainForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // let testSplitPercentage = document.getElementById('testSplit').value

    let trainFilePath = remote.getGlobal('sharedObj').trainFilePath;

    Papa.parse(trainFilePath, {
        worker: true,
        header: true,
        download: true,
        dynamicTyping: true,
        skipEmptyLines: "greedy",
        complete: function(results) {
            console.log("FINISHED");

            let resultsJSON = {
                obs: results,
                predictiveVariables: [],
                targetVariables: []
            }

            let predictiveVariableSet = remote.getGlobal('sharedObj').predictiveVariableList;
            let targetVariableSet = remote.getGlobal('sharedObj').targetVariableList;
            for (header of remote.getGlobal('sharedObj').orderedHeaders) {

                if (predictiveVariableSet.has(header)) {
                    resultsJSON.predictiveVariables.push(header);
                }

                if (targetVariableSet.has(header)) {
                    resultsJSON.targetVariables.push(header);
                }
            }

            var filterJSONWorker = new Worker('../utils/filterJSON.js');

            filterJSONWorker.addEventListener('message', function(event) {
                filterJSONWorker.terminate();
                filterJSONWorker = null;

                let trainObs = event.data.trainObs;

                let testObs = event.data.testObs;

                delete event.data;

                // TODO: integrate one hot encoding
                let trainSplitPercentage = document.getElementById('trainSplit').value
                let results = trainTestSplit(trainObs, testObs, trainSplitPercentage);

                console.log(results);

                let modelHTML = remote.getGlobal('sharedObj').modelHTML;
                let networkJSON = htmlToNetworkJSON(modelHTML);
                let model = buildNetwork(networkJSON, [getGlobal('sharedObj').predictiveVariableList.size]);

                model.fit(tf.tensor(results.train_X), tf.tensor(results.train_y), {
                    epochs: 5,
                    callbacks: {
                        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`),

                        onTrainEnd: (logs) => {
                            console.log("Finished train: ");
                            console.log(logs);

                            let modelResults = model.evaluate(tf.tensor(results.test_X), tf.tensor(results.test_y));

                            console.log("Test result: ")
                            modelResults.print();
                        }
                    }
                });


            }, false);

            // results.predictiveVariableSet = remote.getGlobal('sharedObj').predictiveVariableList;
            // results.targetVariableSet = remote.getGlobal('sharedObj').targetVariableList;
            // results.orderedHeaders = remote.getGlobal('sharedObj').orderedHeaders

            filterJSONWorker.postMessage(resultsJSON);
        }
    });
});