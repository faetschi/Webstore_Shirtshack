$(document).ready(function() {
    // init load all coupons
    fetchCoupons();

    $('#createNewCouponBtn').click(function() {
        $('#newCouponForm').show();
    });

    $('#createCouponForm').submit(function(e) {
        e.preventDefault();

        console.log('Discount Type:', $('#discountType').val());
        console.log('Discount Amount:', $('#discountAmount').val());
        console.log('Expiration Date:', $('#expirationDate').val());

        var couponData = {
            code: String(generateCouponCode()),
            discountType: $('#discountType').val(),
            discountAmount: parseFloat($('#discountAmount').val()),
            expirationDate: $('#expirationDate').val()
        };

        console.log('Coupon Data:', couponData); // Debugging: Log the constructed couponData object
        createCoupon(couponData);
    });

    function generateCouponCode() {
        var length = 5;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var couponCode = '';
        for (var i = 0; i < length; i++) {
            couponCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return couponCode;
    }
    function fetchCoupons() {
        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                logicComponent: 'couponsManager',
                method: 'getCoupons',
                param: {}
            }),
            contentType: 'application/json',
            success: function(response) {
                if (response.status === 'success') {
                    // clear existing coupons list
                    $("#couponList").empty();
                
                    response.data.forEach(function(coupon) {
                        function checkCoupon(expirationDate) {
                            const now = new Date();
                            let status = expirationDate < now ? "Expired" : "Active";
                            return status;
                        }
                        var expirationDate = new Date(coupon.expirationDate);
                        const status = checkCoupon(expirationDate);
                        var discountDisplay = coupon.discountType === 'Percentage' ? `${coupon.discountAmount}%` : `€${coupon.discountAmount}`; // Corrected to match database schema


                        // Construct the row for each coupon
                        var rowStyle = status === "Expired" ? 'style="color: grey;"' : "";
                        var row = `<tr ${rowStyle}">
                                    <td>${coupon.id}</td>
                                    <td>${coupon.code}</td>
                                    <td>${discountDisplay}</td>
                                    <td>${coupon.discountType}</td>
                                    <td>${coupon.expirationDate}</td>
                                    <td>${status}</td>
                                   </tr>`;
                        $("#couponList").append(row);
                    });
                } else if (response.status === 'error') {
                    console.error("Response Error: Error fetching coupons:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Ajax Call: Error fetching coupons:", status, error);
            }
        });
    }

    function createCoupon(couponData) {
        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                logicComponent: 'couponsManager',
                method: 'createCoupon',
                param: {
                    code: couponData.code,
                    discountType: couponData.discountType,
                    discountAmount: couponData.discountAmount,
                    expirationDate: couponData.expirationDate
                }
            }),
            contentType: 'application/json',
            success: function(response) {
                if (response.status === 'success') {
                    alert('Coupon created successfully!');
                    $('#newCouponForm').hide();
                    fetchCoupons();
                } else {
                    alert('Failed to create coupon. Please try again.');
                }
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    }

    function checkCoupon(couponId) {
        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                logicComponent: 'couponsManager',
                method: 'checkCouponValidity',
                param: { 
                    code: couponId
                }
            }),
            contentType: 'application/json',
            success: function(response) {
                if (response.status === 'success' && response.isValid) {
                    alert('Coupon is valid!');
                } else if (response.status === 'success' && !response.isValid){
                    alert('Coupon is invalid or expired!');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error checking coupon:", status, error);
            }
        });
    }
});