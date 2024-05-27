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
                            <td><input class="input-field" id="salutations-${customer.id}" value="${customer.salutations}" disabled></td>
                            <td><input class="input-field" id="firstname-${customer.id}" value="${customer.firstname}" disabled></td>
                            <td><input class="input-field" id="lastname-${customer.id}" value="${customer.lastname}" disabled></td>
                            <td><input class="input-field" id="username-${customer.id}" value="${customer.username}" disabled></td>
                            <td><input class="input-field" id="email-${customer.id}" value="${customer.email}" disabled></td>
                            <td><input class="input-field" id="street-${customer.id}" value="${customer.street}" disabled></td>
                            <td><input class="input-field" id="city-${customer.id}" value="${customer.city}" disabled></td>
                            <td><input class="input-field" id="zip-${customer.id}" value="${customer.zip}" disabled></td>
                            <td><input class="input-field" id="payment_option-${customer.id}" value="${customer.payment_option}" disabled></td>
                            <td>
                                <div style="display: flex; justify-content: space-between;">
                                    <button class="btn btn-primary btn-sm edit-btn" data-customer-id="${customer.id}" style="margin-right: 5px;">Edit</button>
                                    <button class="btn btn-success btn-sm save-btn" data-customer-id="${customer.id}" style="display: none;">Save</button>
                                    <button class="btn btn-danger btn-sm delete-btn" data-customer-id="${customer.id}">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    customerList.append(row);
                });
                
                $('.edit-btn').on('click', function () {
                    var customerId = $(this).data('customer-id');
                    editCustomer(customerId);
                });
                
                $('.save-btn').on('click', function () {
                    var customerId = $(this).data('customer-id');
                    saveCustomer(customerId);
                });
                
                $('.delete-btn').on('click', function () {
                    var customerId = $(this).data('customer-id');
                    deleteCustomer(customerId);
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

function editCustomer(customerId) {
    $('#salutations-' + customerId).prop('disabled', false);
    $('#firstname-' + customerId).prop('disabled', false);
    $('#lastname-' + customerId).prop('disabled', false);
    $('#username-' + customerId).prop('disabled', false);
    $('#email-' + customerId).prop('disabled', false);
    $('#street-' + customerId).prop('disabled', false);
    $('#city-' + customerId).prop('disabled', false);
    $('#zip-' + customerId).prop('disabled', false);
    var paymentOption = $('#payment_option-' + customerId);
    var currentOption = paymentOption.val();
    paymentOption.replaceWith(`
        <select class="form-control" id="payment_option-${customerId}" name="payment_option">
            <option value="Credit" ${currentOption === 'Credit' ? 'selected' : ''}>Credit Card</option>
            <option value="Monthly" ${currentOption === 'Monthly' ? 'selected' : ''}>Monthly Invoice</option>
        </select>
    `);

    $('.edit-btn[data-customer-id="' + customerId + '"]').hide();
    $('.save-btn[data-customer-id="' + customerId + '"]').show();
}

function saveCustomer(customerId) {
    var salutations = $('#salutations-' + customerId).val();
    var firstname = $('#firstname-' + customerId).val();
    var lastname = $('#lastname-' + customerId).val();
    var username = $('#username-' + customerId).val();
    var email = $('#email-' + customerId).val();
    var street = $('#street-' + customerId).val();
    var city = $('#city-' + customerId).val();
    var zip = $('#zip-' + customerId).val();
    var payment_option = $('#payment_option-' + customerId).val();

    var data = {
        id: customerId,
        salutations: salutations,
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        street: street,
        city: city,
        zip: zip,
        payment_option: payment_option
    }

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'updateCustomer',
            method: 'handleRequest',
            param: data
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from updateCustomer:', response);
            if (response.status === 'success') {
                alert('Customer updated successfully');
                loadUserDataForEdit();
            } else {
                alert('Failed to update customer: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error updating customer.', textStatus, errorThrown);
            alert('Error updating customer. Please try again.');
        }
    });
}
