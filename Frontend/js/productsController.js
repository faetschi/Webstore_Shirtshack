$(document).ready(function () {
    
});

function loadCategories() {
    $.ajax({
        url: '../../Backend/logic/getCategories.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var categories = response.data;
                var categoryFilter = $('#categoryFilter');
                
                categories.forEach(function (category) {
                    var option = $('<option></option>').attr('value', category.id).text(category.name);
                    categoryFilter.append(option);
                });
            } else {
                alert('Failed to load categories: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading categories.', textStatus, errorThrown);
            alert('Error loading categories. Please try again.');
        }
    });
}

function loadProducts() {
    $.ajax({
        url: '../../Backend/logic/getProducts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response); 
            if (response.status === 'success') {
                var products = response.data;
                var productList = $('#productList');
                var productTemplate = $('#product-template').html();

                productList.empty(); 
                
                products.forEach(function (product) {
                    var productCard = $(productTemplate).clone();
                    productCard.find('.card-img-top').attr('src', 'path/to/your/image.jpg').attr('alt', product.name); 
                    productCard.find('.card-title').text(product.name);
                    productCard.find('.card-text').text(product.description);
                    productCard.find('.card-price').text('Price: $' + product.price);
                    productCard.attr('data-category', product.category_id);
                    productCard.find('.btn').attr('data-product-id', product.id); 

                    productList.append(productCard);
                });
                filterProducts();

                
                $('.btn').on('click', function () {
                    var productId = $(this).attr('data-product-id');
                    console.log("Add to Cart clicked for product ID: " + productId); 
                    addToCart(productId);
                });
            } else {
                alert('Failed to load products: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading products.', textStatus, errorThrown);
            alert('Error loading products. Please try again.');
        }
    });
}

function addToCart(productId) {
    console.log("Sending AJAX request to add product to cart with ID: " + productId); 
    $.ajax({
        url: '../../Backend/logic/addToCart.php',
        type: 'POST',
        data: JSON.stringify({ productId: productId }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response); 
            if (response.status === 'success') {
                alert('Product added to cart');
            } else {
                alert('Failed to add product to cart: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error adding product to cart.', textStatus, errorThrown);
            alert('Error adding product to cart. Please try again.');
        }
    });
}




//////////////////////////////////////// Admin function for products ////////////////////////////////////////


function loadProductsForEdit() {
    console.log('Loading products for edit...'); 
    $.ajax({
        url: '../../Backend/logic/getProducts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log('Response from getProducts:', response); 
            if (response.status === 'success') {
                var products = response.data;
                var productTableBody = $('#productTableBody');

                productTableBody.empty(); 

                products.forEach(function (product) {
                    var row = `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td>${product.price}</td>
                            <td>${product.category_name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-btn" data-product-id="${product.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-product-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    productTableBody.append(row);
                });

                $('.edit-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    editProduct(productId);
                });

                $('.delete-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    deleteProduct(productId);
                });
            } else {
                alert('Failed to load products: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading products.', textStatus, errorThrown);
            alert('Error loading products. Please try again.');
        }
    });
}

function addProduct() {
    var name = $('#addProductName').val();
    var description = $('#addProductDescription').val();
    var price = $('#addProductPrice').val();
    var category_id = $('#addProductCategory').val();

    $.ajax({
        url: '../../Backend/logic/addProduct.php',
        type: 'POST',
        data: JSON.stringify({
            name: name,
            description: description,
            price: price,
            category_id: category_id
        }),
        contentType: 'application/json',
        success: function (response) {
            if (response.status === 'success') {
                alert('Product added successfully');
                loadProductsForEdit();
                $('#addProductForm').trigger('reset').hide();
            } else {
                alert('Failed to add product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error adding product.', textStatus, errorThrown);
            alert('Error adding product. Please try again.');
        }
    });
}


function filterProducts() {
    var searchValue = $('#searchBar').val().toLowerCase();
    var categoryValue = $('#categoryFilter').val();

    $('#productList .col-lg-4').filter(function () {
        var matchesSearch = $(this).text().toLowerCase().indexOf(searchValue) > -1;
        var matchesCategory = categoryValue === 'all' || $(this).attr('data-category') === categoryValue;

        $(this).toggle(matchesSearch && matchesCategory);
    });
}
