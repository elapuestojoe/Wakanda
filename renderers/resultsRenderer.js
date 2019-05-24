var remote = require('electron').remote;

// console.log(typeof(remote.getGlobal('sharedObj').predictiveVariableList))

let set = remote.getGlobal('sharedObj').predictiveVariableList
console.log(set.size)

console.log(set.has(5))

console.log(...set)
    // var arr = Array.from(remote.getGlobal('sharedObj').predictiveVariableList)
    // console.log(arr)
    // console.log(remote.getGlobal('sharedObj').predictiveVariableList.values())
    // for (item of remote.getGlobal('sharedObj').predictiveVariableList.entries()) {
    //     console.log(item)
    // }

// for (item of remote.getGlobal('sharedObj').targetVariableList.entries()) {
//     console.log(item)
// }