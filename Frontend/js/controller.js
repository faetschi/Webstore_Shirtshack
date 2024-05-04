$(document).ready(function () { 
    includes();
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
                sessionStorage.setItem('username', username);
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
                $('.admin-only').hide();
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