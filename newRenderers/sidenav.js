window.$ = window.jQuery = require('../jquery-3.4.1/jquery-3.4.1.js');

$(document).ready(() => {
    $('.sidenavBtn').on('click', (event) => {
        $('.sidenav a.active').removeClass('active');
        $(event.target).addClass('active');
    });
});