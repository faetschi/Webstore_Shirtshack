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
            logicComponent: 'customerManager',
            method: 'createCustomer',
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
            //console.log(response) // debug
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
            method: 'login',
            param: {
                credentials: credentials,
                password: password,
                remember: remember
            }
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            //console.log(response); // debug
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
            logicComponent: 'customerManager',
            method: 'getUsername',
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
                        logicComponent: 'customerManager',
                        method: 'getCustomer',
                        param: {
                            credentials: username,
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
            logicComponent: 'customerManager',
            method: 'updateCustomer',
            param: {
                username: $('#username').val(),
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

// Admin functions

function loadUserDataForEdit() {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'customerManager',
            method: 'getAllCustomers',
            param: {}
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                var customers = response.data;
                var customerList = $('#customerList');

                customerList.empty();

                $.each(customers, function(_, customer) {
                    var row = `
                        <tr>
                            <td>${customer.id}</td>
                            <td>${customer.salutations}</td>
                            <td>${customer.firstname}</td>
                            <td>${customer.lastname}</td>
                            <td>${customer.username}</td>
                            <td>${customer.email}</td>
                            <td>${customer.street}</td>
                            <td>${customer.city}</td>
                            <td>${customer.zip}</td>
                            <td>${customer.payment_option}</td>
                            <td>
                                <div style="display: flex; justify-content: space-between;">
                                    <button class="btn btn-success btn-sm enable-btn" data-customer-id="${customer.id}" ${customer.active == '0' ? '' : 'style="display: none;"'}>Enable</button>
                                    <button class="btn btn-danger btn-sm disable-btn" data-customer-id="${customer.id}" ${customer.active == '1' ? '' : 'style="display: none;"'}>Disable</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    customerList.append(row);
                });
                
                $(document).on('click', '.enable-btn', function () {
                    var customerId = $(this).attr('data-customer-id');
                    enableCustomer(customerId);
                });
                
                $(document).on('click', '.disable-btn', function () {
                    var customerId = $(this).attr('data-customer-id');
                    disableCustomer(customerId);
                });

            } else {
                console.error('Error getting customers.', response.error);
                alert('Error getting customers. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error getting customers.', textStatus, errorThrown);
            alert('Error getting customers. Please try again.');
        }
    });
}

function enableCustomer(customerId) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'customerManager',
            method: 'enableCustomer',
            param: {
                id: customerId
            }
        }),
        success: function(response) {
            if (response.status === 'success') {
                alert('Customer enabled successfully.');
                $(`.enable-btn[data-customer-id="${customerId}"]`).hide();
                $(`.disable-btn[data-customer-id="${customerId}"]`).show();
            } else {
                console.error('Error enabling customer.', response.error);
                alert('Error enabling customer. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error enabling customer.', textStatus, errorThrown);
            alert('Error enabling customer. Please try again.');
        }
    });
}

function disableCustomer(customerId) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'customerManager',
            method: 'disableCustomer',
            param: {
                id: customerId
            }
        }),
        success: function(response) {
            if (response.status === 'success') {
                alert('Customer disabled successfully.');
                $(`.disable-btn[data-customer-id="${customerId}"]`).hide();
                $(`.enable-btn[data-customer-id="${customerId}"]`).show();
            } else {
                console.error('Error disabling customer.', response.error);
                alert('Error disabling customer. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error disabling customer.', textStatus, errorThrown);
            alert('Error disabling customer. Please try again.');
        }
    });
}



