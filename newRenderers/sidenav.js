const { ipcRenderer } = require('electron')
window.$ = window.jQuery = require('../jquery-3.4.1/jquery-3.4.1.js');

$(document).ready(() => {
    $('.sidenavBtn').on('click', (event) => {

        if (!event.target.classList.contains('active')) {
            $('.sidenav a.active').removeClass('active');
            $(event.target).addClass('active');

            ipcRenderer.send('updateWebView', true);
        }
    });
});