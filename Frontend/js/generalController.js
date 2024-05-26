$(document).ready(function () {
    includes();
});


function includes() {
    includeNavbar();
}

function checkIsAdmin() {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'isAdmin',
            method: 'handleRequest',
            param: {}
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.isAdmin !== true) {
                window.location.href = '../sites/home.html';
            } else {

            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error checking admin status.', textStatus, errorThrown);
            alert('Error checking admin status. Please try again.');
        }
    });
}

function includeNavbar() {
    $.ajax({
        url: '../sites/navbar.html',
        type: 'GET',
        success: function (response) {
            $('#navbarContainer').html(response); 
            var loggedIn = sessionStorage.getItem('loggedIn') || localStorage.getItem('loggedIn');
            var isAdmin = sessionStorage.getItem('isAdmin') || localStorage.getItem('isAdmin');

            if (loggedIn === 'true') {
                // user is logged in
                document.querySelectorAll('.no-user').forEach(function(element) {
                    element.style.display = 'none'; // hide elements
                });
                document.querySelectorAll('.user-only').forEach(function(element) {
                    element.style.display = 'block'; // show elements
                });
                if (isAdmin === 'true') {
                    // user is an admin
                    document.querySelectorAll('.admin-only').forEach(function(element) {
                        element.style.display = 'block'; 
                    });
                }
            } else {
                // user is not logged in
                document.querySelectorAll('.no-user').forEach(function(element) {
                    element.style.display = 'block'; 
                });
                document.querySelectorAll('.user-only, .admin-only').forEach(function(element) {
                    element.style.display = 'none';
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading navbar.', textStatus, errorThrown);
        }
    });
}

function logout() {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'logout',
            method: 'handleRequest',
            param: {}
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.status == 'LoggedOut') {
                sessionStorage.clear();
                localStorage.clear();
                $('.admin-only, .user-only').hide();
                $('.no-user').show();
            } else {
                alert('Logout failed. Please try again.');
            }
            window.location.href = '../sites/home.html';
        },
        error: function (textStatus, errorThrown) {
            console.error('Error logging out.', textStatus, errorThrown);
        }
    });
}