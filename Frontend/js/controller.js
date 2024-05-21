$(document).ready(function () { 
    includes();
});

function includes() {
    includeNavbar();
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

function register() {
    var salutations = $('#salutations').val();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var repassword = $('#repassword').val();
    var street = $('#street').val();
    var city = $('#city').val();
    var zip = $('#zip').val();
    var payment = $('#payment').val();

    if (password !== repassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            // every front end request needs to have these 3 parameters
            logicComponent: 'createCustomer',
            method: 'handleRequest',
            param: {
                salutations: salutations,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                password: password,
                street: street,
                city: city,
                zip: zip,
                payment: payment
            }
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log(response) // debug
            if (response.status === 'success') {
                window.location.href = '../sites/login.html';
            } else if (response.status === 'email_exists') {
                alert('A customer with this email already exists.');
            } else if (response.status === 'username_exists') {
                alert('A customer with this username already exists.');
            }
             else {
                alert('Registration failed. Please try again.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error registering.', textStatus, errorThrown);
            console.error('Response:', jqXHR.responseText);
        }
    });
}

function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    var remember = $("#remember").is(":checked");

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            // every front end request needs to have these 3 parameters
            logicComponent: 'login',
            method: 'handleRequest',
            param: {
                username: username,
                password: password,
                remember: remember
            }
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log(response); // debug
            if (response.status == 'success') {
                // store user details in session storage
                if (remember) {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false');
                    localStorage.setItem('username', response.username);
                } else {
                    sessionStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false');
                    sessionStorage.setItem('username', response.username);
                }
                window.location.href = '../sites/home.html';
            } else {
                alert('Login failed. Please try again.');
            }
        },
        error: function (textStatus, errorThrown) {
            alert('Login failed. Please try again.');
            console.error('Error logging in.', textStatus, errorThrown);
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

function loadUserData() {
    // First AJAX call to get the username
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'getUsername',
            method: 'handleRequest',
            param: {}
        }),
        contentType: 'application/json',
        success: function(response) {
            // Check if the username was retrieved successfully
            if (response.username) {
                var username = response.username;

                // Second AJAX call to load the user data
                $.ajax({
                    url: '../../Backend/config/serviceHandler.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        logicComponent: 'getCustomer',
                        method: 'handleRequest',
                        param: {
                            username: username,
                        }
                    }),
                    contentType: 'application/json',
                    success: function(response) {
                        if (response.status === 'success') {
                            var data = response.data;
                            $('#salutations').val(data.salutations);
                            $('#firstname').val(data.firstname);
                            $('#lastname').val(data.lastname);
                            $('#email').val(data.email);
                            $('#username').val(data.username);
                            $('#street').val(data.street);
                            $('#city').val(data.city);
                            $('#zip').val(data.zip);
                            $('#payment').val(data.payment_option);
                        }
                    },
                    error: function(textStatus, errorThrown) {
                        console.error('Error loading user data.', textStatus, errorThrown);
                        alert('Error loading user data. Please try again.');
                    }
                });
            } else {
                console.error('Error getting username.', response.error);
                alert('Error getting username. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error getting username.', textStatus, errorThrown);
            alert('Error getting username. Please try again.');
        }
    });
}

/*
function loadUserData() {
    var username = $('#username').val();

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'getCustomer',
            method: 'handleRequest',
            param: {
                username: username,
            }
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                var data = response.data;
                $('#salutations').val(data.salutations);
                $('#firstname').val(data.firstname);
                $('#lastname').val(data.lastname);
                $('#email').val(data.email);
                $('#username').val(data.username);
                $('#street').val(data.street);
                $('#city').val(data.city);
                $('#zip').val(data.zip);
                $('#payment').val(data.payment);
            } else {
                console.error('Error loading user data.', response.message);
                alert('Error loading user data. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error loading user data.', textStatus, errorThrown);
            alert('Error loading user data. Please try again.');
        }
    });
}
*/

function saveUserData() {
    var salutations = $('#salutations').val();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var username = $('#username').val();
    var street = $('#street').val();
    var city = $('#city').val();
    var zip = $('#zip').val();
    var payment = $('#payment').val();

}
