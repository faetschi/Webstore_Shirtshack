$(document).ready(function () {

});

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
    var credentials = $('#credentials').val();
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
                credentials: credentials,
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
                    localStorage.setItem('userId', response.customer_id);
                } else {
                    sessionStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false');
                    sessionStorage.setItem('username', response.username);
                    sessionStorage.setItem('userId', response.customer_id);
                }
                window.location.href = '../sites/home.html';
            } else if (response.status === 'disabled') {
                alert('Your account has been disabled.');
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

function loadUserData() {
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

                // Second AJAX call to load the user data based on username
                $.ajax({
                    url: '../../Backend/config/serviceHandler.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        logicComponent: 'getCustomer',
                        method: 'handleRequest',
                        param: {
                            credentials: username,  // Now using credentials, which accepts username or email
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
                            $('#username').val(data.username); // Consider this field to handle both email and username if needed
                            $('#street').val(data.street);
                            $('#city').val(data.city);
                            $('#zip').val(data.zip);
                            $('#payment').val(data.payment_option);
                        } else {
                            alert('Failed to load user data: ' + response.message);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('Error loading user data.', textStatus, errorThrown);
                        alert('Error loading user data. Please try again.');
                    }
                });
            } else {
                console.error('Error getting username.', response.error);
                alert('Error getting username. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error getting username.', textStatus, errorThrown);
            alert('Error getting username. Please try again.');
        }
    });
}


function saveUserDataAccount() {
    var currentPassword = $('#currentpassword').val();
    var newPassword = $('#newpassword').val();
    var renewPassword = $('#renewpassword').val();

    var email = $('#email').val();
    var zip = $('#zip').val();

    // Regular expressions for validation
    var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    var zipRegex = /^\d{4}$/;

    if (newPassword && newPassword !== renewPassword) {
        alert('New passwords do not match.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!zipRegex.test(zip)) {
        alert('Please enter a valid ZIP code with exactly 4 digits.');
        return;
    }
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'updateCustomer',
            method: 'handleRequest',
            param: {
                username: $('#username').val(),  // Assuming user ID is available in the form or through session
                currentPassword: currentPassword,
                newPassword: newPassword,
                salutations: $('#salutations').val(),
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                email: $('#email').val(),
                street: $('#street').val(),
                city: $('#city').val(),
                zip: $('#zip').val(),
                payment_option: $('#payment').val()
            }
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                alert('Changes saved successfully.');
            } else {
                alert(response.message || 'Error saving changes. Please try again.');
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Error saving user data:', textStatus, errorThrown);
            var errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error saving user data. Please try again.';
            alert(errorMessage);
        }
    });
}
