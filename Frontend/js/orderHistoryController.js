document.addEventListener('DOMContentLoaded', function() {
    fetchUserOrders();
});

function fetchUserOrders() {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
        console.log("User not logged in");
        return;
    }

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'OrderHistoryHandler',
            method: 'handleRequest',
            param: {
                userId: userId
            }
        }),
        contentType: 'application/json',
        success: function(response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                displayOrders(data.orders);
            } else {
                console.error('Failed to retrieve orders:', data.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching orders:', textStatus, errorThrown);
        }
    });
}    

function displayOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    // Sort orders by date ascending
    orders.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));

    orders.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-entry';

        const orderDate = new Date(order.order_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        orderDiv.innerHTML = `
            <div class="order-summary">
                <h3>
                    <span class="order-number">Order ${index + 1}</span>
                    <span class="order-date"> - Placed on ${orderDate}</span>
                </h3>
                <p>Total: $${order.total_price}</p>
                <div class="order-buttons">
                    <button class="btn-view-details" onclick="toggleDetails(${index}, ${order.order_id})">View Details</button>
                    <button class="btn-print-invoice" onclick="printInvoice(${order.order_id})">Print Invoice</button>
                </div>
            </div>
            <div class="order-details" id="details-${index}" style="display:none;"></div>
        `;

        orderList.appendChild(orderDiv);
    });
}

function toggleDetails(index, orderId) {
    const detailsDiv = document.getElementById(`details-${index}`);
    if (detailsDiv.style.display === 'none' || detailsDiv.innerHTML === '') {
        if (detailsDiv.innerHTML === '') {
            $.ajax({
                url: '../../Backend/config/serviceHandler.php',
                type: 'POST',
                data: JSON.stringify({
                    logicComponent: 'fetchOrderItemsHandler',
                    method: 'handleRequest',
                    param: {
                        orderId: orderId
                    }
                }),
                contentType: 'application/json',
                success: function(response) {
                    const data = JSON.parse(response);
                    if (data.status === 'success') {
                        let itemsHtml = data.items.map(item => 
                            `<div>${item.product_name} - Quantity: ${item.quantity} - Price: $${item.price}</div>`
                        ).join('');
                        detailsDiv.innerHTML = itemsHtml;
                    } else {
                        detailsDiv.innerHTML = `<p>${data.message}</p>`;
                    }
                    detailsDiv.style.display = 'block';
                },
                error: function() {
                    detailsDiv.innerHTML = '<p>Failed to load data.</p>';
                }
            });
        } else {
            detailsDiv.style.display = 'block';
        }
    } else {
        detailsDiv.style.display = 'none';
    }
}

function printInvoice(orderId) {
    $.ajax({
        url: `../../Backend/logic/printInvoice.php?orderId=${orderId}`,
        type: 'GET', // or 'POST' if you adjust your server-side accordingly
        success: function(data) {
            var blob = new Blob([data], { type: 'text/html' });
            var url = URL.createObjectURL(blob);
            var win = window.open('', '_blank');
            win.document.write(data); // Writes the fetched HTML data into new window
            win.document.close(); // Close the document to finish writing
            win.print(); // Triggers the print dialog in the new window
        },
        error: function(xhr, status, error) {
            console.error('Error fetching invoice:', status, error);
        }
    });
}