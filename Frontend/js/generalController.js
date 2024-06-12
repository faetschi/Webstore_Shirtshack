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

function checkIsAdmin() {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'login',
            method: 'isAdmin',
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

            updateCartCount();

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
            
            // Hide cart count in cart.html
            if (window.location.pathname.endsWith('cart.html')) {
                $('#cart-count').hide();
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
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('username');
                localStorage.removeItem('userId');
                
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userId');

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

function getSessionCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}


function updateCartCount() {
    
    var sessionCart = getSessionCart();

    // Calculate the total quantity of items in the cart
    var totalQuantity = sessionCart.reduce(function(sum, item) {
        // Convert the quantity to a number and add it to the sum
        var quantity = Number(item.quantity);
        return sum + quantity;
    }, 0);

    var cartCountElement = $('#cart-count');
    cartCountElement.text(totalQuantity);
    
}


