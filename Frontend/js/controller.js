$(document).ready(function () { 
    includeNavbar();
});



function includeNavbar() {
    $.ajax({
        url: '../sites/navbar.php',
        type: 'GET',
        success: function (response) {
            $('#navbarContainer').html(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading navbar.', textStatus, errorThrown);
        }
    });
}

function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    var remember = $("#remember").is(":checked");

    $.ajax({
        url: '../../Backend/logic/login.php',
        type: 'POST',
        data: JSON.stringify({
            username: username,
            password: password,
            remember: remember
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.status == 'LoggedIn') {
                window.location.href = '../sites/home.html';
            } else {
                alert('Login failed. Please try again.');
            }
        },
        error: function (textStatus, errorThrown) {
            console.error('Error logging in.', textStatus, errorThrown);
        }
    });
}

function logout() {
    $.ajax({
        url: '../../Backend/logic/logout.php',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.status == 'LoggedOut') {
                window.location.href = '../sites/home.html';
            } else {
                alert('Logout failed. Please try again.');
            }
        },
        error: function (textStatus, errorThrown) {
            console.error('Error logging out.', textStatus, errorThrown);
        }
    });
}