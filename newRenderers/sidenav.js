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

ipcRenderer.on('inputDataLoaded', (event, flag) => {
    if (flag) {
        document.getElementById('loadDataSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    }
});

ipcRenderer.on('scanAndValidateLayers', (event, flag) => {
    if (flag) {
        document.getElementById('designSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    } else {
        document.getElementById('designSidenavIcon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    }
});