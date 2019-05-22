const { app, dialog } = require('electron').remote
const session = require('electron').remote.session;
var csvHeaders = require('csv-headers');
var fs = require('fs')
const { ipcRenderer } = require('electron')

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
            alert('An error occured reading the file.')
            return
        }
        var textArea = document.getElementById('output')
        textArea.value = data

        document.getElementById('loadedFileTextArea').innerHTML = "Loaded file: " + filepath
        processFirstLine(filepath)
    })
}

function processFirstLine(filepath) {
    var options = {
        file: filepath,
        delimiter: ','
    };
    csvHeaders(options, function(err, headers) {
        if (!err)
            console.log(headers);

        clearHeaders()
        addHeaders(headers)
    });
}

function clearHeaders() {
    var ul = document.getElementById("headersList");
    while (ul.firstChild) ul.removeChild(ul.firstChild);
}

function addHeaders(headers) {
    for (header in headers) {
        var node = document.createElement('li'); // Create a <li> node

        // Set up checkbox
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = "id";
        var label = document.createElement('label');

        if (header == headers.length - 1) {
            checkbox.checked = true
        }

        node.appendChild(checkbox);

        var textnode = document.createTextNode(headers[header]); // Create a text node
        node.appendChild(textnode); // Append the text to <li>
        document.getElementById("headersList").appendChild(node); // Append <li> to <ul> with id="myList" 
    }
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
            readFile(fileNames[0])

            // Send to main so it can set it up as global variable
            ipcRenderer.send('trainFilePath', fileNames[0])
        }
    })
}