$(document).ready(function () {
    includes();


    //Product page
    if (window.location.pathname.endsWith('products.html')) {
        loadCategories();
        loadProducts();

        // event listener for search bar
        $('#searchBar').on('keyup', function () {
            filterProducts();
        });

        // event listener for category filter
        $('#categoryFilter').on('change', function () {
            filterProducts();
        });
    } else if (window.location.pathname.endsWith('editproducts.html')) {
        checkIsAdmin();
        loadProductsForEdit();

        $('#createProductBtn').on('click', function () {
            $('#addProductForm').toggle();
        });

        $('#addProductForm').on('submit', function (event) {
            event.preventDefault();
            addProduct();
        });
    }
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

// TODO save the changes made in account.html to the db
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

function loadCategories() {
    $.ajax({
        url: '../../Backend/logic/getCategories.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var categories = response.data;
                var categoryFilter = $('#categoryFilter');
                
                categories.forEach(function (category) {
                    var option = $('<option></option>').attr('value', category.id).text(category.name);
                    categoryFilter.append(option);
                });
            } else {
                alert('Failed to load categories: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading categories.', textStatus, errorThrown);
            alert('Error loading categories. Please try again.');
        }
    });
}

function loadProducts() {
    $.ajax({
        url: '../../Backend/logic/getProducts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response); 
            if (response.status === 'success') {
                var products = response.data;
                var productList = $('#productList');
                var productTemplate = $('#product-template').html();

                productList.empty(); 
                
                products.forEach(function (product) {
                    var productCard = $(productTemplate).clone();
                    productCard.find('.card-img-top').attr('src', 'path/to/your/image.jpg').attr('alt', product.name); 
                    productCard.find('.card-title').text(product.name);
                    productCard.find('.card-text').text(product.description);
                    productCard.find('.card-price').text('Price: $' + product.price);
                    productCard.attr('data-category', product.category_id);
                    productCard.find('.btn').attr('data-product-id', product.id); 

                    productList.append(productCard);
                });
                filterProducts();

                
                $('.btn').on('click', function () {
                    var productId = $(this).attr('data-product-id');
                    console.log("Add to Cart clicked for product ID: " + productId); 
                    addToCart(productId);
                });
            } else {
                alert('Failed to load products: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading products.', textStatus, errorThrown);
            alert('Error loading products. Please try again.');
        }
    });
}

function addToCart(productId) {
    console.log("Sending AJAX request to add product to cart with ID: " + productId); 
    $.ajax({
        url: '../../Backend/logic/addToCart.php',
        type: 'POST',
        data: JSON.stringify({ productId: productId }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response); 
            if (response.status === 'success') {
                alert('Product added to cart');
            } else {
                alert('Failed to add product to cart: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error adding product to cart.', textStatus, errorThrown);
            alert('Error adding product to cart. Please try again.');
        }
    });
}

function filterProducts() {
    var searchValue = $('#searchBar').val().toLowerCase();
    var categoryValue = $('#categoryFilter').val();

    $('#productList .col-lg-4').filter(function () {
        var matchesSearch = $(this).text().toLowerCase().indexOf(searchValue) > -1;
        var matchesCategory = categoryValue === 'all' || $(this).attr('data-category') === categoryValue;

        $(this).toggle(matchesSearch && matchesCategory);
    });
}








//////////////////////////////////////// Admin function for products ////////////////////////////////////////


function loadProductsForEdit() {
    console.log('Loading products for edit...'); 
    $.ajax({
        url: '../../Backend/logic/getProducts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log('Response from getProducts:', response); 
            if (response.status === 'success') {
                var products = response.data;
                var productTableBody = $('#productTableBody');

                productTableBody.empty(); 

                products.forEach(function (product) {
                    var row = `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td>${product.price}</td>
                            <td>${product.category_name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-btn" data-product-id="${product.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-product-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    productTableBody.append(row);
                });

                $('.edit-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    editProduct(productId);
                });

                $('.delete-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    deleteProduct(productId);
                });
            } else {
                alert('Failed to load products: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading products.', textStatus, errorThrown);
            alert('Error loading products. Please try again.');
        }
    });
}

function addProduct() {
    var name = $('#addProductName').val();
    var description = $('#addProductDescription').val();
    var price = $('#addProductPrice').val();
    var category_id = $('#addProductCategory').val();

    $.ajax({
        url: '../../Backend/logic/addProduct.php',
        type: 'POST',
        data: JSON.stringify({
            name: name,
            description: description,
            price: price,
            category_id: category_id
        }),
        contentType: 'application/json',
        success: function (response) {
            if (response.status === 'success') {
                alert('Product added successfully');
                loadProductsForEdit();
                $('#addProductForm').trigger('reset').hide();
            } else {
                alert('Failed to add product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error adding product.', textStatus, errorThrown);
            alert('Error adding product. Please try again.');
        }
    });
}