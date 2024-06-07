document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
    fetchPaymentOption();
    document.getElementById('place-order-btn').addEventListener('click', submitOrder);
    document.getElementById('applyVoucherBtn').addEventListener('click', function() {
        applyVoucher();
    });
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

const vouchers = {
    "SAVE10": {
        description: "Save $10 on your order",
        discount: 10 // This is a fixed amount discount
    },
    "10PERCENT": {
        description: "Save 10% on your order",
        discount: 0.10, // This represents a 10% discount
        type: 'percent'
    }
};

function applyVoucher() {
    const voucherCode = document.getElementById('voucherCode').value.toUpperCase();
    const voucher = vouchers[voucherCode];
    if (voucher) {
        let originalTotal = parseFloat(document.getElementById('order-total').textContent);
        let discountAmount;

        if (voucher.type === 'percent') {
            discountAmount = originalTotal * voucher.discount;
        } else {
            discountAmount = voucher.discount;
        }

        let newTotal = originalTotal - discountAmount;
        document.getElementById('order-total').textContent = newTotal.toFixed(2);

        updateDiscountDisplay(discountAmount, originalTotal, newTotal);
    } else {
        alert("Invalid voucher code.");
    }
}

function updateDiscountDisplay(discountAmount, originalTotal, newTotal) {
    let discountInfo = document.getElementById('discount-info');
    discountInfo.innerHTML = `
        <p>Original Total: $${originalTotal.toFixed(2)}</p>
        <p>Discount Applied: -$${discountAmount.toFixed(2)}</p>
        <p>New Total: $${newTotal.toFixed(2)}</p>
    `;
}
