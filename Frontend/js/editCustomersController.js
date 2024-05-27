function loadUserDataForEdit() {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            logicComponent: 'getAllCustomers',
            method: 'handleRequest',
            param: {}
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.status === 'success') {
                var customers = response.data;
                var customerList = $('#customerList');

                customerList.empty();

                $.each(customers, function(_, customer) {
                    var row = `
                        <tr>
                            <td>${customer.id}</td>
                            <td>${customer.salutations}</td>
                            <td>${customer.firstname}</td>
                            <td>${customer.lastname}</td>
                            <td>${customer.username}</td>
                            <td>${customer.email}</td>
                            <td>${customer.street}</td>
                            <td>${customer.city}</td>
                            <td>${customer.zip}</td>
                            <td>${customer.payment_option}</td>
                            <td>
                                <div style="display: flex; justify-content: space-between;">
                                    <button class="btn btn-success btn-sm enable-btn" data-customer-id="${customer.id}" ${customer.active == '0' ? '' : 'style="display: none;"'}>Enable</button>
                                    <button class="btn btn-danger btn-sm disable-btn" data-customer-id="${customer.id}" ${customer.active == '1' ? '' : 'style="display: none;"'}>Disable</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    customerList.append(row);
                });
                
                $(document).on('click', '.enable-btn', function () {
                    var customerId = $(this).attr('data-customer-id');
                    enableCustomer(customerId);
                });
                
                $(document).on('click', '.disable-btn', function () {
                    var customerId = $(this).attr('data-customer-id');
                    disableCustomer(customerId);
                });

            } else {
                console.error('Error getting customers.', response.error);
                alert('Error getting customers. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error getting customers.', textStatus, errorThrown);
            alert('Error getting customers. Please try again.');
        }
    });
}

function enableCustomer(customerId) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php', // Replace with your API endpoint
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'enableCustomer',
            method: 'handleRequest',
            param: {
                id: customerId
            }
        }),
        success: function(response) {
            if (response.status === 'success') {
                alert('Customer enabled successfully.');
                $(`.enable-btn[data-customer-id="${customerId}"]`).hide();
                $(`.disable-btn[data-customer-id="${customerId}"]`).show();
            } else {
                console.error('Error enabling customer.', response.error);
                alert('Error enabling customer. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error enabling customer.', textStatus, errorThrown);
            alert('Error enabling customer. Please try again.');
        }
    });
}

function disableCustomer(customerId) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php', // Replace with your API endpoint
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'disableCustomer',
            method: 'handleRequest',
            param: {
                id: customerId
            }
        }),
        success: function(response) {
            if (response.status === 'success') {
                alert('Customer disabled successfully.');
                $(`.disable-btn[data-customer-id="${customerId}"]`).hide();
                $(`.enable-btn[data-customer-id="${customerId}"]`).show();
            } else {
                console.error('Error disabling customer.', response.error);
                alert('Error disabling customer. Please try again.');
            }
        },
        error: function(textStatus, errorThrown) {
            console.error('Error disabling customer.', textStatus, errorThrown);
            alert('Error disabling customer. Please try again.');
        }
    });
}
