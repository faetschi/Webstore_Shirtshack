$(document).ready(function() {
    const orderId = new URLSearchParams(window.location.search).get('orderId');
    if (orderId) {
        loadOrderDetails(orderId);
    }

    $('#confirmOrder').click(function() {
        updateOrderStatus(orderId, 'Completed');
    });

    $('#cancelOrder').click(function() {
        updateOrderStatus(orderId, 'Cancelled');
    });
});

function loadOrderDetails(orderId) {
    $.ajax({
        url: '../../Backend/logic/getOrder.php',
        method: 'GET',
        data: { orderId: orderId },
        success: function(response) {
            if (response.status === 'success') {
                displayOrderItems(response.orderItems);
            } else {
                console.error('Failed to load order items:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching order items:', status, error);
        }
    });
}

function updateOrderStatus(orderId, status) {
    $.ajax({
        url: '../../Backend/logic/updateOrderStatus.php',
        method: 'POST',
        data: { orderId: orderId, status: status },
        success: function(response) {
            if (response.status === 'success') {
                alert('Order status updated to ' + status);
                window.location.reload();
            } else {
                alert('Failed to update order status: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            alert('Error updating order status.');
        }
    });
}

function displayOrderItems(items) {
    const container = $('#orderItems');
    container.empty();
    items.forEach(item => {
        const element = $('<div>').addClass('row').text(`${item.name}: ${item.quantity} x $${item.price}`);
        container.append(element);
    });
    updateOrderTotal(items);
}

function updateOrderTotal(items) {
    let total = 0;
    items.forEach(item => {
        total += item.quantity * item.price;
    });
    $('#orderTotal').text(total.toFixed(2));
}
