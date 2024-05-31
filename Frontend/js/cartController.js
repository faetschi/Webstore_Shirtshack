$(document).ready(function() {
    loadCartItems();

    // Event listeners for increase and decrease quantity buttons
    $('#cartItems').on('click', '.increase-qty', function() {
        let productId = $(this).closest('.card').data('product-id');
        updateCartCount();
        updateQuantity(productId, 1);
        updateCartCount();
    });

    $('#cartItems').on('click', '.decrease-qty', function() {
        let productId = $(this).closest('.card').data('product-id');
        updateCartCount();
        updateQuantity(productId, -1);        
        updateCartCount();
    });

    // Event listener for remove button
    $('#cartItems').on('click', '.btn-danger', function() {
        let productId = $(this).closest('.card').data('product-id');
        console.log("Product ID:", productId);
        if (productId) {
            removeFromCart(productId);
        } else {
            console.error("Failed to capture the product ID.");
        }
    });

    updateCartCount();
    updateCartTotal();

    $('#checkoutButton').click(function() {
        // Log current total before navigating
        console.log("Navigating to order.html with cart total:", localStorage.getItem('cartTotal'));
        // Redirect to the order review page
        window.location.href = '../sites/order.html';
    });
});



function loadCartItems() {
    $.ajax({
        url: '../../Backend/logic/getCarts.php',
        method: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                displayCartItems(response.data.items);
                updateCartTotal();
            } else {
                console.error('Failed to load cart items:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching cart items:', status, error);
            console.log('Server response:', xhr.responseText);
        }
    });
}

function displayCartItems(items) {
    const container = $('#cartItems');
    const template = $('#cart-item-template').html();
    container.empty();
    console.log(items);

    items.forEach(item => {
        let element = $(template);
        element.find('.card').attr('data-product-id', item.product_id);
        element.find('.card-img-top').attr('src', item.image).attr('alt', item.name);
        element.find('.card-title').text(item.name);
        element.find('.card-text').text(item.description);
        element.find('.card-price').text('Price: $' + item.price);
        element.find('.cart-quantity').text(item.quantity);
        element.attr('data-product-id', item.product_id);
        container.append(element);
    });
}

function updateCartTotal() {
    let total = 0;
    $('#cartItems .card').each(function() {
        let priceText = $(this).find('.card-price').text().replace('Price: $', '');
        let price = parseFloat(priceText);
        let quantity = parseInt($(this).find('.cart-quantity').text());

        // Log values for debugging
        console.log('Price:', price, 'Quantity:', quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });
    $('#cartTotal').text(total.toFixed(2));

    // Store the total as a string and log it
    localStorage.setItem('cartTotal', total.toFixed(2));
    console.log("Updated cart total in localStorage:", total.toFixed(2));
}


function updateQuantity(productId, change) {
    let qtyElement = $('div[data-product-id="' + productId + '"]').find('.cart-quantity');
    let newQty = parseInt(qtyElement.text()) + change;

    if (newQty > 0) {
        // Update the quantity on the server
        $.ajax({
            url: '../../Backend/logic/updateCartItem.php',
            method: 'POST',
            data: {
                productId: productId,
                quantity: newQty
            },
            success: function(response) {
                if (response.status === 'success') {
                    qtyElement.text(newQty);
                    updateCartTotal();
                } else {
                    alert('Failed to update quantity: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error updating quantity.');
            }
        });
    } else {
        removeFromCart(productId);
    }
}

function removeFromCart(productId) {
    console.log("Trying to remove product with ID:", productId);

    $.ajax({
        url: '../../Backend/logic/removeCartItem.php',
        method: 'POST',
        data: { productId: productId },
        success: function(response) {
            if (response.status === 'success') {
                $('div[data-product-id="' + productId + '"]').remove();
                updateCartTotal();
            } else {
                alert('Failed to remove item: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error when trying to remove item:', status, error);
            alert('Error removing item.');
        }
    });
}
