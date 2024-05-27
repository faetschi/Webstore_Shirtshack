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
            } else if (response.status == 'disabled') {
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
            // check if the username was retrieved successfully
            if (response.username) {
                var username = response.username;

                // second AJAX call to load the user data
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
                            // TODO Dropdown Menu for Payment is missing
                            $('#payment').val(data.payment);
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

function saveUserDataAccount() {
    var salutations = $('#salutations').val();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var username = $('#username').val();
    var street = $('#street').val();
    var city = $('#city').val();
    var zip = $('#zip').val();
    var payment_option = $('#payment').val();

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'updateCustomer',
            method: 'handleRequest',
            param: {
                salutations: salutations,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                street: street,
                city: city,
                zip: zip,
                payment_option: payment_option
            }
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                alert('Changes saved successfully.');
            } else {
                alert('Error saving changes. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error saving user data.', textStatus, errorThrown);
            alert('Error saving user data. Please try again.');
        }
    });

}