$(document).ready(function() {
    var sessionId = getSessionId();

    loadCartFromSession(sessionId);
    

    $(document).on('click', '.increase-quantity-btn', function() {
        adjustQuantity(this, 1);
    });

    $(document).on('click', '.decrease-quantity-btn', function() {
        adjustQuantity(this, -1);
    });

    $(document).on('click', '.remove-item-btn', function() {
        // Get the cart from sessionStorage at the start of the event handler
        var cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
    
        // Get the index of the cart item element in the cart
        var index = $(this).closest('.cart-item').index();
    
        // Get the product ID from the cart item object
        var productId = cartItems[index].productId;
    
        $(this).closest('.cart-item').remove();
    
        // Remove the item from the cartItems array
        var newCartItems = cartItems.filter(function(item) {
            return item.productId !== productId;
        });
    
        // You might also want to update the total
        updateCartTotal(newCartItems);
    
        // Update the cart in sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(newCartItems));
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
    } catch (error) {
      console.error("Error parsing cart data from session:", error);
    }
}


function updateCartDisplay(cartItems) {
    var cartList = $('#cart-summary');
    cartList.empty();
    cartItems.forEach(function(item) {
        var itemHtml = `
            <div class="cart-item" data-product-id="${item.product_id}">
                <p>${item.name} - $${item.price} x 
                <button class="btn btn-small btn-secondary decrease-quantity-btn">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="btn btn-small btn-secondary increase-quantity-btn data-product-id="${item.product_id}"">+</button>
                <button class="btn btn-small btn-danger remove-item-btn data-product-id="${item.product_id}"">Remove</button>
                </p>
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


function adjustQuantity(button, delta) {
    var productId = $(button).closest('.cart-item').data('product-id');
    var currentQuantity = parseInt($(button).siblings('.item-quantity').text());
    var newQuantity = currentQuantity + delta;

    if (newQuantity < 1) {
        alert("Quantity cannot be less than 1.");
        return;
    }
    updateQuantity(productId, newQuantity);
}  

function getSessionId() {
    return sessionStorage.getItem('sessionId') || generateNewSessionId();
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function generateNewSessionId() {
    var newSessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', newSessionId);
    return newSessionId;
}
