$(document).ready(function () {
    loadProducts();
    updateCartCount();

    if (window.location.pathname.endsWith('editproducts.html')) {
        checkIsAdmin();
        loadProductsForEdit();
        loadCategoriesForForm();

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
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'getCategories',
            param: {}
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from getCategories:', response);
            if (response.status === 'success') {
                var categories = response.data;
                var categorySelect = $('#addProductCategory');

                categorySelect.empty();
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
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'getProductsWithCategory',
            param: {}
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.status === 'success') {
                var products = response.data;
                var productList = $('#productList');
                productList.empty();

                products.forEach(function(product) {
                    var productPrice = parseFloat(product.price);
                    var productImage = product.image ? 'data:image/png;base64,' + product.image : '/path/to/placeholder.jpg';
                    var productItem = `
                        <div class="col-md-4" data-product-id="${product.id}">
                            <div class="card">
                                <img src="${productImage}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-price">${productPrice.toFixed(2)}</p>
                                    <button class="btn btn-secondary add-to-cart-btn">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.append(productItem);
                });

                $('.add-to-cart-btn').click(function() {
                    var productId = $(this).closest('[data-product-id]').data('product-id');
                    var productName = $(this).siblings('.card-title').text();
                    var productPrice = parseFloat($(this).siblings('.card-price').text());
                    var quantity = 1;
                    addToCart(productId, productName, productPrice, quantity);
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



function addToCart(productId, productName, productPrice, quantity) {
    addToSessionCart(productId, productName, productPrice, quantity);
    updateCartCount();
    showNotification('Product added to cart!');

}

function addToSessionCart(productId, productName, productPrice, quantity) {
    var cart = getSessionCart();
    var existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            name: productName,
            price: parseFloat(productPrice), // Ensured parsing here for consistency
            quantity: quantity
        });
    }
    console.log(cart);
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function getSessionCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

function updateCartCount() {
    var sessionCart = getSessionCart();
    var count = sessionCart.reduce((total, item) => total + item.quantity, 0);
    $('#cart-count').text(count);
    
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function showNotification(message) {
    var notificationContainer = $('#notificationContainer');
    var notification = $('<div class="alert alert-success" role="alert">' + message + '</div>');

    notification.css({
        'width': '300px',
        'position': 'fixed',
        'top': '95%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)'
    });

    notificationContainer.append(notification);

    setTimeout(function() {
        notification.fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}



//////////////////////////////////////// Admin function for products ////////////////////////////////////////

/*
function loadProductsForEdit() {
    console.log('Loading products for edit...');
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'getProductsWithCategory',
            param: {}
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from getProductsWithCategory:', response);
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
                                <input type="file" class="form-control" id="image-${product.id}">
                            </td>
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
}*/

function loadProductsForEdit() {
    console.log('Loading products for edit...');
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'getProductsWithCategory',
            param: {}
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from getProductsWithCategory:', response);
            if (response.status === 'success') {
                var products = response.data;
                var productTableBody = $('#productTableBody');

                productTableBody.empty();
                console.log('Product table cleared');

                products.forEach(function (product) {
                    console.log('Appending product:', product);
                    var imageFilename = product.image ? 'Current image: ' + product.image.substring(0, 30) + '...' : 'No image available';
                    var row = `
                        <tr>
                            <td>${product.id}</td>
                            <td><input type="text" class="form-control" value="${product.name}" id="name-${product.id}" disabled></td>
                            <td><input type="text" class="form-control" value="${product.description}" id="description-${product.id}" disabled></td>
                            <td><input type="number" class="form-control" value="${product.price}" id="price-${product.id}" disabled></td>
                            <td><input type="text" class="form-control" value="${product.category_name}" id="category-${product.id}" disabled></td>
                            <td>
                                <span id="current-image-${product.id}">${imageFilename}</span>
                                <input type="file" class="form-control mt-2" id="image-${product.id}">
                            </td>
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


/*
function saveProduct(productId) {
    var name = $('#name-' + productId).val();
    var description = $('#description-' + productId).val();
    var price = $('#price-' + productId).val();
    var category = $('#category-' + productId).val();

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'updateProduct',
            param: {
                id: productId,
                name: name,
                description: description,
                price: price,
                category: category
            }
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from updateProduct:', response);
            if (response.status === 'success') {
                alert('Product updated successfully');
                loadProductsForEdit();
            } else if (response.status === 'noExist') {
                alert('Category Name does not exist');
            } else {
                alert('Failed to update product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error updating product.', textStatus, errorThrown, jqXHR.responseText);
            alert('Error updating product. Please try again.');
        }
    });
}*/




function addProduct() {
    var name = $('#addProductName').val();
    var description = $('#addProductDescription').val();
    var price = $('#addProductPrice').val();
    var category_id = $('#addProductCategory').val();
    var imageFile = $('#addProductImage')[0].files[0];

    var reader = new FileReader();
    reader.onloadend = function() {
        var imageBase64 = reader.result.split(',')[1];

        var productData = {
            logicComponent: 'ProductManager',
            method: 'addProduct',
            param: {
                name: name,
                description: description,
                price: price,
                category_id: category_id,
                imageBase64: imageBase64
            }
        };

        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            data: JSON.stringify(productData),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log('Response from addProduct:', response);
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
    };
    
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        alert("Please select an image.");
    }
}


/*
function saveProduct(productId) {
    var name = $('#name-' + productId).val();
    var description = $('#description-' + productId).val();
    var price = $('#price-' + productId).val();
    var category = $('#category-' + productId).val();
    var imageFile = $('#image-' + productId)[0].files[0];
    	
    
    if (!imageFile) {

        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            data: JSON.stringify({
                logicComponent: 'ProductManager',
                method: 'getImage',
                param: {
                    id: productId
                }
            }),
            contentType: 'application/json',
            success: function (response) {
                if (response.status === 'success') {
                    imageFile = response.imagePath;
                    ///TODO : image file is bas64 atm; change that; when 
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error retrieving current image.', textStatus, errorThrown, jqXHR.responseText);
                alert('Error retrieving current image. Please try again.');
            }
        });
    }


    // Image file is image ab diesem moment 
    var reader = new FileReader();
    reader.onloadend = function () {
        var base64Image = reader.result.split(',')[1]; // Get base64 part of the image

        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            data: JSON.stringify({
                logicComponent: 'ProductManager',
                method: 'updateProduct',
                param: {
                    id: productId,
                    name: name,
                    description: description,
                    price: price,
                    category: category,
                    image: base64Image
                }
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('Response from updateProduct:', response);
                if (response.status === 'success') {
                    alert('Product updated successfully');
                    loadProductsForEdit();
                } else if (response.status === 'noExist') {
                    alert('Category Name does not exist');
                } else {
                    alert('Failed to update product: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error updating product.', textStatus, errorThrown, jqXHR.responseText);
                alert('Error updating product. Please try again.');
            }
        });
    };
    reader.readAsDataURL(imageFile); // Convert image to Base64
}*/

function saveProduct(productId) {
    var name = $('#name-' + productId).val();
    var description = $('#description-' + productId).val();
    var price = $('#price-' + productId).val();
    var category = $('#category-' + productId).val();
    var imageFile = $('#image-' + productId)[0].files[0];

    if (!imageFile) {
        // No new image, use the current image
        $.ajax({
            url: '../../Backend/config/serviceHandler.php',
            type: 'POST',
            data: JSON.stringify({
                logicComponent: 'ProductManager',
                method: 'getImage',
                param: { id: productId }
            }),
            contentType: 'application/json',
            success: function (response) {
                if (response.status === 'success') {
                    var currentImage = response.imagePath; // Base64 image from server
                    updateProduct(productId, name, description, price, category, currentImage);
                } else {
                    alert('Failed to retrieve current image: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error retrieving current image.', textStatus, errorThrown, jqXHR.responseText);
                alert('Error retrieving current image. Please try again.');
            }
        });
    } else {
        var reader = new FileReader();
        reader.onloadend = function () {
            var base64Image = reader.result.split(',')[1]; // Get base64 part of the new image
            updateProduct(productId, name, description, price, category, base64Image);
        };
        reader.readAsDataURL(imageFile); // Convert image to Base64
    }
}




function updateProduct(productId, name, description, price, category, image) {
    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'updateProduct',
            param: {
                id: productId,
                name: name,
                description: description,
                price: price,
                category: category,
                image: image
            }
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Response from updateProduct:', response);
            if (response.status === 'success') {
                alert('Product updated successfully');
                loadProductsForEdit();
            } else if (response.status === 'noExist') {
                alert('Category Name does not exist');
            } else {
                alert('Failed to update product: ' + response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error updating product.', textStatus, errorThrown, jqXHR.responseText);
            alert('Error updating product. Please try again.');
        }
    });
}











function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    $.ajax({
        url: '../../Backend/config/serviceHandler.php',
        type: 'POST',
        data: JSON.stringify({
            logicComponent: 'ProductManager',
            method: 'deleteProduct',
            param: {
                id: productId
            }
        }),
        dataType: 'json',
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
            console.error('Error deleting product.', textStatus, errorThrown, jqXHR.responseText);
            alert('Error deleting product. Please try again.');
        }
    });
}


function filterProducts() {
    var searchValue = $('#searchBar').val().toLowerCase();
    var categoryValue = $('#categoryFilter').val().toLowerCase();

    $('#productList .col-md-4').filter(function () {
        var matchesSearch = $(this).text().toLowerCase().indexOf(searchValue) > -1;
        var matchesCategory = categoryValue === 'all' || $(this).data('category').toLowerCase() === categoryValue;

        $(this).toggle(matchesSearch && matchesCategory);
    });
}

