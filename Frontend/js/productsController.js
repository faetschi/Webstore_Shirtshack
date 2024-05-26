$(document).ready(function () {
    if (window.location.pathname.endsWith('editproducts.html')) {
        checkIsAdmin();
        loadProductsForEdit();
        loadCategoriesForForm(); // Load categories for the form

        $('#createProductBtn').on('click', function () {
            $('#addProductForm').toggle();
        });

        $('#addProductForm').on('submit', function (event) {
            event.preventDefault();
            addProduct();
        });
    }
});

function loadCategoriesForForm() {
    $.ajax({
        url: '../../Backend/logic/getCategories.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log('Response from getCategories:', response); // Debugging line
            if (response.status === 'success') {
                var categories = response.data;
                var categorySelect = $('#addProductCategory');
                
                categorySelect.empty(); // Clear existing options
                categories.forEach(function (category) {
                    var option = $('<option></option>').attr('value', category.id).text(category.name);
                    categorySelect.append(option);
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
                
                response.data.forEach(function(product) {
                    var productItem = `
                        <div class="col-md-4">
                            <div class="card">
                                <img src="/path/to/your/image.jpg" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-price">${product.price}</p>
                                    <a href="/product/${product.id}" class="btn btn-primary">View Product</a>
                                </div>
                            </div>
                        </div>
                    `;
        
                    productList.append(productItem);
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
                console.log('Product table cleared');

                products.forEach(function (product) {
                    console.log('Appending product:', product);
                    var row = `
                        <tr>
                            <td>${product.id}</td>
                            <td><input type="text" class="form-control" value="${product.name}" id="name-${product.id}" disabled></td>
                            <td><input type="text" class="form-control" value="${product.description}" id="description-${product.id}" disabled></td>
                            <td><input type="number" class="form-control" value="${product.price}" id="price-${product.id}" disabled></td>
                            <td><input type="text" class="form-control" value="${product.category_name}" id="category-${product.id}" disabled></td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-btn" data-product-id="${product.id}">Edit</button>
                                <button class="btn btn-success btn-sm save-btn" data-product-id="${product.id}" style="display:none;">Save</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-product-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    productTableBody.append(row);
                });

                console.log('All products appended');

                $('.edit-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    editProduct(productId);
                });

                $('.save-btn').on('click', function () {
                    var productId = $(this).data('product-id');
                    saveProduct(productId);
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




function editProduct(productId) {
    $('#name-' + productId).prop('disabled', false);
    $('#description-' + productId).prop('disabled', false);
    $('#price-' + productId).prop('disabled', false);
    $('#category-' + productId).prop('disabled', false);
    $('.edit-btn[data-product-id="' + productId + '"]').hide();
    $('.save-btn[data-product-id="' + productId + '"]').show();
}



function saveProduct(productId) {
    var name = $('#name-' + productId).val();
    var description = $('#description-' + productId).val();
    var price = $('#price-' + productId).val();
    var category = $('#category-' + productId).val();

    $.ajax({
        url: '../../Backend/logic/updateProduct.php',
        type: 'POST',
        data: JSON.stringify({
            id: productId,
            name: name,
            description: description,
            price: price,
            category: category
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from updateProduct:', response); // Debugging line
            if (response.status === 'success') {
                alert('Product updated successfully');
                loadProductsForEdit();
            } else {
                alert('Failed to update product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error updating product.', textStatus, errorThrown);
            alert('Error updating product. Please try again.');
        }
    });
}




function addProduct() {
    var name = $('#addProductName').val();
    var description = $('#addProductDescription').val();
    var price = $('#addProductPrice').val();
    var category_id = $('#addProductCategory').val();

    console.log('Adding product:', {
        name: name,
        description: description,
        price: price,
        category_id: category_id
    }); // Debugging line

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
            console.log('Response from addProduct:', response); // Debugging line
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


function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    $.ajax({
        url: '../../Backend/logic/deleteProduct.php',
        type: 'POST',
        data: JSON.stringify({
            id: productId
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from deleteProduct:', response);
            if (response.status === 'success') {
                alert('Product deleted successfully');
                loadProductsForEdit();
            } else {
                alert('Failed to delete product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error deleting product.', textStatus, errorThrown);
            alert('Error deleting product. Please try again.');
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
