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
    console.log("Applying voucher:", voucherCode);  // Debugging
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
            console.log("Response from server:", response);  // Debugging
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
    console.log("Applying discount:", discountAmount, "Type:", discountType);  // Debugging
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
