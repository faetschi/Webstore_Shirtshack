document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
    fetchPaymentOption();
    document.getElementById('place-order-btn').addEventListener('click', submitOrder);
    document.getElementById('applyVoucherBtn').addEventListener('click', applyVoucher);
});

function loadOrderDetails() {
    let cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    let orderSummary = document.getElementById('order-summary');
    let total = 0;

    cartItems.forEach(item => {
        let row = document.createElement('tr');
        let html = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        row.innerHTML = html;
        orderSummary.appendChild(row);
        total += item.price * item.quantity;
    });

    document.getElementById('order-total').textContent = total.toFixed(2);
}

function fetchPaymentOption() {
    var userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in storage.');
        return;
    }

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'GetPaymentOption',
            method: 'handleRequest',
            param: {
                id: userId
            }
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success' && response.payment_option) {
                var mappedPaymentOption = mapPaymentOption(response.payment_option);
                $('#paymentMethod').val(mappedPaymentOption);
            } else {
                console.error('Failed to retrieve payment option:', response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching payment option:', textStatus, errorThrown);
        }
    });
}

function mapPaymentOption(paymentOption) {
    switch (paymentOption) {
        case 'Credit':
            return 'credit_card';
        case 'Monthly':
            return 'invoice';
        default:
            return '';
    }
}

function submitOrder() {
    let paymentMethod = document.getElementById('paymentMethod').value;
    let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    let orderDetails = {
        userId: userId,
        items: JSON.parse(sessionStorage.getItem('cart')),
        total: parseFloat(document.getElementById('order-total').textContent),
        paymentMethod: paymentMethod
    };

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        method: 'POST',
        data: JSON.stringify({
            logicComponent: 'placeOrder',
            method: 'handleRequest',
            param: orderDetails
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                sessionStorage.removeItem('cart');
                window.location.href = '../sites/orderConfirmation.html';
            } else {
                alert('Failed to place the order. Please try again.');
            }
        },
        error: function() {
            alert('Error placing order. Please try again.');
        }
    });
}

function applyVoucher() {
    let voucherCode = document.getElementById('voucherCode').value;

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',  // Update this URL as needed
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'couponsManager',
            method: 'verifyVoucherCode',  // This should match the method name expected by your PHP switch-case
            param: { voucherCode: voucherCode }
        }),
        contentType: 'application/json',
        success: function(response) {
            
            if (response.status === 'success' && response.discountAmount) {
                applyDiscount(parseFloat(response.discountAmount), response.discountType);
                // Disable the apply voucher button
                disableApplyVoucherButton();
            } else {
                alert('Invalid voucher code. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);  // Debugging
            alert('Error verifying voucher code. Please try again.');
        }
    });
}

function disableApplyVoucherButton() {
    let applyVoucherBtn = document.getElementById('applyVoucherBtn');
    applyVoucherBtn.disabled = true;
    applyVoucherBtn.style.backgroundColor = 'grey';  // Change this to match your desired style
    applyVoucherBtn.style.cursor = 'not-allowed';  // Optional: Change the cursor to indicate it's disabled
    applyVoucherBtn.textContent = 'Voucher Applied';  // Optional: Change the button text to indicate it's been used
}

function applyDiscount(discountAmount, discountType) {
   
    if (isNaN(discountAmount)) {
        console.error("Invalid discount amount:", discountAmount);  // Debugging
        alert('Error applying discount. Please try again.');
        return;
    }

    let totalElement = document.getElementById('order-total');
    let currentTotal = parseFloat(totalElement.textContent);
    let newTotal;

    if (discountType === 'Percentage') {
        newTotal = Math.max(0, currentTotal - (currentTotal * (discountAmount / 100))).toFixed(2);
        document.getElementById('discount-info').textContent = `Discount Applied: ${discountAmount}%`;
    } else if (discountType === 'Fixed') {
        newTotal = Math.max(0, currentTotal - discountAmount).toFixed(2);
        document.getElementById('discount-info').textContent = `Discount Applied: $${discountAmount.toFixed(2)}`;
    } else {
        console.error("Unknown discount type:", discountType);  // Debugging
        alert('Error applying discount. Please try again.');
        return;
    }

    totalElement.textContent = newTotal;
}

function displayOrderDetailsForCustomer() {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('customerId');

    if (!customerId) {
        window.location.href = '../sites/editcustomers.html';
        return;
    }
    

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'orderManager',
            method: 'getOrderByCustomerId',
            param: { customerId: parseInt(customerId)}
        }),
        contentType: 'application/json',
        success: function(response) {
            const ordersContainer = $('#customerList');
            ordersContainer.empty(); // Clear previous entries
            if (response.status === 'success') {

                $.each(response.data, function(_, order) {
                    const orderRow = $(`
                        <tr>
                            <td>${order.order_id}</td>
                            <td>$${parseFloat(order.total_price).toFixed(2)}</td>
                            <td>${order.payment_option}</td>
                            <td>${new Date(order.order_date).toLocaleDateString()}</td>
                            <td>
                                <div style="display: flex; justify-content;">
                                    <button class="btn btn-danger btn-sm delete-btn" data-order-id="${order.order_id}">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `);
                    ordersContainer.append(orderRow);
                });

                $(document).on('click', '.delete-btn', function () {
                    var orderId = $(this).attr('data-order-id');
                    deleteOrder(orderId);
                });

            } else if (response.status === 'error') {
                alert('Failed to fetch order for customerId ' + customerId + '');
                window.location.href = '../sites/editcustomers.html';
            } else if (response.status === 'notfound') {
                alert('No orders found for this customer');
                window.location.href = '../sites/editcustomers.html';
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching order:', textStatus, errorThrown);
        }
    });
}

function deleteOrder(orderId) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'orderManager',
            method: 'deleteOrderById',
            param: { orderId: orderId }
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                // Remove the order row from the UI
                $('button[data-order-id="' + orderId + '"]').closest('tr').remove();
                alert('Order deleted successfully');
            } else {
                alert('Failed to delete order with ID: ' + orderId);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error deleting order:', textStatus, errorThrown);
            alert('Error deleting order. Please try again.');
        }
    });
}