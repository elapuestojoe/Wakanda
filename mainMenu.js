const { getCurrentWindow } = require('electron');
var reload = () => {
    getCurrentWindow().reload()
}

module.exports = [{
        label: 'Electron',
        submenu: [{
                label: 'Greet',
                click: () => { console.log("HEY") },
                accelerator: 'Shift+Alt+G'
            },
            { label: 'Item 2' },
            {
                label: "Reload",
                click: () => { reload },
                accelerator: 'Ctrl+R'
            }
        ]
    },
    {
        label: 'Actions',
        submenu: [
            { label: 'Action 1', enabled: false },
            { label: 'Action 2' },
            { label: 'Action 3' }
        ]
    }
]