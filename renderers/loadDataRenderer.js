const { dialog } = require('electron').remote
var remote = require('electron').remote;
var csvHeaders = require('csv-headers');
var fs = require('fs')
const { ipcRenderer } = require('electron')

window.$ = window.jQuery = require('../jquery-3.4.1/jquery-3.4.1.js');

let trainFilePath

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
            alert('An error occured reading the file.')
            return
        }
        var textArea = document.getElementById('output')
        textArea.value = data

        document.getElementById('loadedFileTextArea').innerHTML = "Loaded file: " + filepath
    })
}

function processFirstLine(filepath) {
    var options = {
        file: filepath,
        delimiter: ','
    };
    csvHeaders(options, function(err, headers) {
        if (!err) {
            console.log(headers);

            clearHeaders()
            processHeaders(headers)
        }
    });
}

function clearHeaders() {
    var ul = document.getElementById("targetVariableList");
    while (ul.firstChild) ul.removeChild(ul.firstChild);
}

function addHeaders(headers, targetId, lastChecked) {
    for (header in headers) {
        var node = document.createElement('li'); // Create a <li> node

        // Set up checkbox
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = headers[header];
        checkbox.id = "id";
        checkbox.setAttribute('correspondingList', targetId)
        var label = document.createElement('label');

        if (header == headers.length - 1) {
            checkbox.checked = lastChecked
        } else {
            checkbox.checked = !lastChecked
        }

        node.appendChild(checkbox);

        var textnode = document.createTextNode(headers[header]); // Create a text node
        node.appendChild(textnode); // Append the text to <li>
        document.getElementById(targetId).appendChild(node); // Append <li> to <ul> with id="myList" 
    }
}

function setConstraintOneCheckBoxSelected(className, message) {

    let $checkBoxes = $('#' + className + ' input[type="checkbox"')

    $checkBoxes.change(function(event) {
        let countChecked = $checkBoxes.filter(':checked').length;
        if (countChecked == 0) {
            alert(message)
            $(this).prop('checked', true)
        }

        let correspondingList = $(this).attr('correspondingList')
        let key = $(this).attr('value')

        if ($(this).is(":checked")) {
            remote.getGlobal('sharedObj')[correspondingList].add(key)
        } else {
            remote.getGlobal('sharedObj')[correspondingList].delete(key)
        }
    })
}

function processHeaders(headers) {

    addHeaders(headers, 'predictiveVariableList', false)
    addHeaders(headers, 'targetVariableList', true)

    for (i = 0; i < headers.length - 1; i++) {
        remote.getGlobal('sharedObj').predictiveVariableList.add(headers[i])
    }

    remote.getGlobal('sharedObj').targetVariableList.add(headers[headers.length - 1])

    console.log(remote.getGlobal('sharedObj').predictiveVariableList.size)
    console.log(remote.getGlobal('sharedObj').targetVariableList.size)

    setConstraintOneCheckBoxSelected('predictiveVariableList', 'You must have at least one predictive variable!')
    setConstraintOneCheckBoxSelected('targetVariableList', 'You must have at least one target variable!')
}

document.getElementById('openButton').onclick = () => {
    dialog.showOpenDialog({
        // Set custom filters
        // properties: ['openFile'],
        // filters: [{
        //   name: 'Images',
        //   extensions: ['jpg', 'jpeg', 'png']
        // }]
    }, (fileNames) => {
        if (fileNames === undefined) {
            alert("No file selected")
        } else {
            trainFilePath = fileNames[0]
            readFile(trainFilePath)
            processFirstLine(trainFilePath)
                // Send to main so it can set it up as global variable
                // ipcRenderer.send('trainFilePath', fileNames[0])
            remote.getGlobal('sharedObj').trainFilePath = trainFilePath
        }
    })
}