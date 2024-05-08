$(document).ready(function () { 
    includes();
});

function getCookie(name) {
    var nameEQ = name + "="; // Construct the cookie name with an equal sign
    var ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
    for (var i = 0; i < ca.length; i++) { // Loop through each cookie
        var c = ca[i]; // Get the current cookie
        while (c.charAt(0) == ' ') c = c.substring(1, c.length); // Trim leading spaces
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); // If the cookie name matches the one we're looking for, return its value
    }
    return null; // If the cookie isn't found, return null
}

function includeNavbar() {
    $.ajax({
        url: '../sites/navbar.html',
        type: 'GET',
        success: function (response) {
            $('#navbarContainer').html(response);
            var remember = getCookie("remember");
            var loggedIn = sessionStorage.getItem('loggedIn');
            var isAdmin = sessionStorage.getItem('isAdmin');
            console.log(loggedIn);
            console.log(isAdmin);

            if (loggedIn === 'true') {
                // User is logged in
                document.querySelectorAll('.no-user').forEach(function(element) {
                    element.style.display = 'none'; // hide elements
                });
                document.querySelectorAll('.user-only').forEach(function(element) {
                    element.style.display = 'block'; // show elements
                });
                if (isAdmin === 'true') {
                    // User is an admin
                    document.querySelectorAll('.admin-only').forEach(function(element) {
                        element.style.display = 'block'; 
                    });
                }
            } else {
                // User is not logged in
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
        url: '../../Backend/logic/register.php',
        type: 'POST',
        data: JSON.stringify({
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
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.status == 'Registered') {
                alert('Registration successful. You can now log in.');
                window.location.href = '../sites/login.html';
            } else {
                alert('Registration failed. Please try again.');
            }
        },
        error: function (textStatus, errorThrown) {
            console.error('Error registering.', textStatus, errorThrown);
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
                // Store user details in session storage
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false');
                // Redirect to home page or wherever needed
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
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
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




function includes() {
    includeNavbar();
}