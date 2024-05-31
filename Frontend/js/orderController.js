$(document).ready(function() {
    createOrderAndLoadItems();
});

function createOrderAndLoadItems() {
    $.ajax({
        url: '../../Backend/logic/createOrder.php',
        method: 'POST',
        success: function(response) {
            console.log('Response from createOrder.php:', response); // Add this line for debugging
            if (response.status === 'success') {
                // Store the order ID and load order items
                const orderId = response.order_id;
                loadOrderItems(orderId);
            } else {
                console.error('Failed to create order:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error creating order:', status, error);
            console.log('Server response:', xhr.responseText);
        }
    });
}

function loadOrderItems(orderId) {
    $.ajax({
        url: `../../Backend/logic/getOrderSummary.php?order_id=${orderId}`,
        method: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                displayOrderItems(response.data.items);
                updateOrderTotal(response.data.totalPrice);
            } else {
                console.error('Failed to load order items:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching order items:', status, error);
            console.log('Server response:', xhr.responseText);
        }
    });
}

function displayOrderItems(items) {
    const container = $('#orderItems');
    const template = $('#order-item-template').html();
    container.empty();
    console.log(items);

    items.forEach(item => {
        let element = $(template);
        element.find('.card').attr('data-product-id', item.product_id);
        element.find('.card-img-top').attr('src', item.image).attr('alt', item.name);
        element.find('.card-title').text(item.name);
        element.find('.card-text').text(item.description);
        element.find('.card-price .price-value').text(item.price);
        element.find('.display-quantity').text(item.quantity);  // Add this line
        element.find('.order-quantity').text(item.quantity);
        container.append(element);
    });
    
}

function updateOrderTotal(totalPrice) {
    $('#orderTotal').text(totalPrice.toFixed(2));
}
