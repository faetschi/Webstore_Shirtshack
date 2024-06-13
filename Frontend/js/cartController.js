$(document).ready(function() {
    var sessionId = getSessionId();
    loadCartFromSession(sessionId);
    
    // Decrease quantity
    $(document).on('click', '.decrease-quantity-btn', function() {
        var productId = $(this).closest('.cart-item').data('product-id'); // Use .data() for consistency
        updateItemQuantity(productId, -1);
    });

    // Increase quantity
    $(document).on('click', '.increase-quantity-btn', function() {
        var productId = $(this).closest('.cart-item').data('product-id'); // Use .data() for consistency
        updateItemQuantity(productId, 1);
    });

    // Remove item
    $(document).on('click', '.remove-item-btn', function() {
        var productId = $(this).closest('.cart-item').data('product-id'); // Use .data() for consistency
        var cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
        var newCartItems = cartItems.filter(function(item) {
            return item.productId !== productId;
        });
        
        // Remove the HTML element for the cart item
        $(this).closest('.cart-item').remove();
        
        // Update the total and the session storage
        updateCartTotal(newCartItems);
        sessionStorage.setItem('cart', JSON.stringify(newCartItems));
    });

    $('#checkout-btn').click(function() {
        if (isLoggedIn()) {
            // Retrieve cartItems from sessionStorage
            var cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
            if(cartItems.length > 0){
                sessionStorage.setItem('cart', JSON.stringify(cartItems));  // Ensure cartItems is current cart data
                window.location.href = '../sites/checkout.html';  // Redirect to order page for final confirmation
            } else {
                alert('Your cart is empty. Please add some items before checking out.');
            }
        } else {
            // User is not logged in, show an alert
            alert('Please log in to place orders.');
        }
    });
    

});

function loadCartFromSession(sessionId) {
    var cartDataString = sessionStorage.getItem('cart');
    if (!cartDataString) {
        console.log("No cart data in session.");
        return;
    }
    
    try {
        var cartData = JSON.parse(cartDataString);
        cartData = cartData.map(item => {
            item.price = item.price || '0.00'; // Default price if undefined
            const itemPrice = parseFloat(item.price);
            item.price = isNaN(itemPrice) ? '0.00' : itemPrice.toFixed(2);
            item.name = item.name || 'Unnamed Item'; // Default name if undefined
            return item;
        });
        console.log("Cart data loaded from session:", cartData);
        updateCartDisplay(cartData);
        updateCartTotal(cartData);
    } catch (error) {
        console.error("Error parsing cart data from session:", error);
    }
}

function updateCartDisplay(cartItems) {
    var cartList = $('#cart-summary');
    cartList.empty();
    cartItems.forEach(function(item) {
        var itemHtml = `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="item-details">
                    <p>${item.name} - $${item.price} x <span class="item-quantity">${item.quantity}</span></p>
                </div>
                <div>
                    <button class="btn btn-small btn-secondary decrease-quantity-btn" data-product-id="${item.productId}">-</button>
                    <button class="btn btn-small btn-secondary increase-quantity-btn" data-product-id="${item.productId}">+</button>
                    <button class="btn btn-small btn-danger remove-item-btn" data-product-id="${item.productId}">Remove</button>
                </div>
            </div>
        `;
        cartList.append(itemHtml);
    });
}


function updateCartTotal(cartItems) {
    var total = cartItems.reduce(function(acc, item) {
        return acc + (parseFloat(item.price) * item.quantity);
    }, 0);
    $('#cart-total').text(`$${total.toFixed(2)}`);
}

function updateItemQuantity(productId, change) {
    var cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    var found = false;

    cartItems = cartItems.map(item => {
        if (item.productId === productId) {
            item.quantity += change;
            found = true;
        }
        return item;
    });

    if (!found) {
        console.error('Product not found:', productId);
        return;
    }

    updateCartDisplay(cartItems);
    updateCartTotal(cartItems);
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
}

function getSessionId() {
    return sessionStorage.getItem('sessionId') || generateNewSessionId();
}

function generateNewSessionId() {
    var newSessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', newSessionId);
    return newSessionId;
}

function isLoggedIn() {
    // Check both localStorage and sessionStorage for user login status
    return localStorage.getItem('loggedIn') === 'true' || sessionStorage.getItem('loggedIn') === 'true';
}