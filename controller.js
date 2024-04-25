$(document).ready(function () { 
    includeNavbar();
});



function includeNavbar() {
    $.ajax({
        url: 'components/navbar.html',
        type: 'GET',
        success: function (response) {
            $('#navbarContainer').html(response);
        },
        error: function () {
            console.error('Error loading navbar.');
        }
    });
}