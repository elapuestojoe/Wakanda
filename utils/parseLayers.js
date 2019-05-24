function trimWhiteSpace(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}

function htmlListToLiItems(html) {
    return html.match(/<li[^>]*>/ig)
}

function liToDictionary(li) {
    // let r = li.match(/[ ]{1}[^ ]*/ig)
    let keyValueArray = li.match(/[a-zA-Z]*=[^ |^/>]*/ig)
    let dictionaryResult = {}

    for (elementId in keyValueArray) {
        let element = keyValueArray[elementId].replace(/\"/g, '').split('=')

        if (element.length == 2) {
            dictionaryResult[element[0]] = element[1]
        }
    }
    return dictionaryResult
}

function htmlToNetworkJSON(html) {
    html = trimWhiteSpace(html)
    let liItems = htmlListToLiItems(html)

    let arrayResult = []

    for (itemId in liItems) {
        let liItem = liItems[itemId]
        let liItemDictionary = liToDictionary(liItem)
        arrayResult.push(liItemDictionary)
    }
    return arrayResult
}

module.exports = {
    htmlToNetworkJSON: htmlToNetworkJSON
}