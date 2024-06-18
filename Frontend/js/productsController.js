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
                    // default image code
                    var productImage = product.image ? 'data:image/png;base64,' + product.image : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAIGAZADASIAAhEBAxEB/8QAGwABAQEBAAMBAAAAAAAAAAAAAAYFBAIDBwH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH6oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcJ3AAAAAOHuAAAAAAAAAAAAAAADxkCxQwr5r8piQzvpWYR9zlZRaIX2FsmP0pkV6i0henXJPTpdQj6X9mivQwuUdXHmAAAAAAAAAAeB54k/pmNT7WeaAAAPTjb4wfGgEirhPee8MDZ9wAAAxpex0DD3JjLLt4eYAAAAAAAeEOb81tU5zdIM/Q4zseHmAAAAAAAAADxOHQ4u0c/QPn9FvTJTIO4PYAAAAes9mFgaxi3HQAAHr9n4cvXxdoAAAAAAAAA5erjPf7fHyAAPRDfQBgb83jF69fsAAHzb6TwmJUw20b4AAHr9nIOv1+wAAAAAAAAAcvV4Hj7ePsAAAEx04hnfSuDvAAAJD3VPzwtu2cowABn6GeaAAAAAAAAAAAM/Qz9AAAcfZOHp5836GAAAAODvEPtZnSVDi7QBn6GYaYAAAAAAAAAAM/QzNMAHIZuJochRaIAAAAAPnn0POM2jh9s3eOe5Dl67WLLYAAAAAAAAAAEVw91ic3bEdJXTnvxDj+h5ukAAAAAAARuN9L/DK1gRNtElsAAAAAAAAAACKs4yzPLK1R8017P8AQAAAAAAAAABE20SWwAAAAAAAAAAIqzjLM8gAAAAAAAAAAAIm2iS2AAAAAAAAAABFWcZZnkAAAAAAAAAAABE20SWwAAAAAAAAAAIqzjLM8gAAAAAAAAAAAIm2iS2AAAAAAAAAABFWcZZnkAAAAAAAAAAABE20SWwAAAAAAAAAAIqzjLM8gAAAAAAAAAAAIm2iS2AAAAAAAAAABFWcZZnkAAAAAAAAAAABE20SWwAAAAAAAAAAIqzjLM8gAAAAAAAAAAAIm2+bn0hiDbYg22INtiDbYg22INtiDbYg22INtiDbYgxbP5z9GPIAAAAAAAAAAACCvZApkwKdMCnTAp0wKdMCnTAp0wKdMCnTAp0wKdMDjupGvP0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//EAC4QAAEDAgQEBQUBAQEAAAAAAAQCAwUAAQYVNUATFiAyEBEUITASIiQlNDGQUP/aAAgBAQABBQL/AJOklMDfGyUw+7/4bxDLFn8Qgt3zKTJoeNuca2UVCqHfaJb6nXUMtvSBMqsiKsE/mMoNTOIQV3YIZftvFXsmz2IQkqzCVJrLpQmmcPAouwOyxajRePSDLeb8ElLnq5gOk4jEtSZ6NvV52NtSsSBV6+VLpuDu+4opDdBi8DweHZfs/h4Fy+WyY1evlhqZxEEpSVWUnbyUkPHoSIbMXCYaEe6nW0Oo9C4xXHOapUize1yYe9WIhrUmQYtb1BrtehdfpppDLfUay2U8oM2IVGyY56dopVkpIlnjHY2HaFXT/wBpO2Z+4mpKIaLUxKvguIVZadjJSY4CUhmy6mGWx2vA72Y2wPuz4PstvtrBMiFRsoOen5lqShL8q+c5GxDQiugy3mIi/wBSNoq/kkK3kH0SUQyYpmUIAcQtK0/HJSg4CUAmS6mGW2G+ly3m2J7ibQq/kKzbya6Xmm321gGRK4yUHPt8C1pQl6UIPcjYhkNXXf8AwL+PaG/xo7euTiGTbsyZMc42tLiOrESL5gtCIx74HL+TYf8AJtC/cVq/m18FkJkyMPt3zPqNGQWNCPKtUepTDnWXfyEbt9Le0Xb6kB38xOuRWp1c09dKARWwxeufDWtKXLSseGQkofqP/l2wPsN1FvpGY+u0YDACLtb4XP0ks/8Agl9RXurbC+y+pr84237yW+I4VBgsK9e6Y9amXOlX3HbZP2ndMi4papl67TQAiAhPjnxF3t9dpMAQhJQ/QMqzj+2KVZt7oKfSMxZdo4KAFXf5r/pJZ78EzwKJaFauQdNXwhpW2xfo6XzoWhCmS2vBH55t/wB3LfMeKg0WFeu43HOKbXITKGXBYdZDvl5WwhpW2xfo9vdBcOtl2PmUuOyLq1XmXvTsRwiARPnnxF1e5c8uPjxwG/DCGlbbF+jp7akABz2rergXIAVxd9jb26MIaVtsX6Ont8P92+ENK22L9HT27nCGlbbF+jp7dzhDStti/R09u5whpW2xfo6e3c4Q0rbYv0dPbucIaVtsX6Ont3OENK22L9HT27nCGlbbF+jp7dzhDStti/R09u5whpW2xfo6e3c4Q0rbYv0dPbucIaVtsX6Ont3OENK22L9HT27nCGlbbF+jp7dzhDStti/R09u5wycKPHZqBWagVmoFZqBWagVmoFZqBWagVmoFZqBWagVmoFZqBWagVmoFZqBWagVmoFZqBWagVmoFZqBWJzhSItPbucKLbTGcRmuIzXEZriM1xGa4jNcRmuIzXEZriM1xGa4jNcRmuIzXEZriM1xGa4jNcRmuIzXEZriM1ixbd4lPbueXI6uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI2uXI3/n5//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQMBAT8BTn//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAECAQE/AU5//8QAQhAAAQICAwoLBgQHAQAAAAAAAQIDAAQRMUAFEiEyNEFRcpGSEyAiMDNCUmJxc8EQFCMkYbFTgaHhQ0SCkNHw8VD/2gAIAQEABj8C/tOt8O4EX5vU0826004lTjeBQ0f+JS86hsd40RetqW8rQ2mPk7nXg7TxiZF2F30wE8hKagnSIDM+FPSdSH05vGA4w4laNI45W6tKEDOTBl7kgpaqXMHBsiUTctwiew001KTnJj5u53CDtMmL10rYVocTFLLqHNU020lRoAzmL1nhH16G0x8rc/gk9p4x83dHgx2WRF84lb6tLiooZaQ3qij2JWhXBvt4UODN+0e73QQGnTgw4i/A+kF65ry5R3QMUxRMyiZpHbaOGKH232Fd5EZSPzSYyobpihlLzytCERRKSPAJ7bxgO3VmVzKuxUkR7tc5tLjicFCcCEeJhS3FcJMOY6/QfT2UPNIcHeFMXzaVsq0tqj5O6N+Oy8KY+aueHU9pkxevcIwvQ4mApJBSaiLR8ZVKzioTWYC58mXlKwwms+MOMsoShFAUmjZ/vjxyh1CVoOYiPkZlbY/DXy0/5EfFlEujtMr9DFD7EwjXZJ+0cpLH9TX7RyUy/wDS1+0US8vML1GCI+DJhsdp5foI+dmVLH4bfIT/AJgIaQlCBmSOO2y6hK0UFSqf9+v6QXLnEvytZYVWPCPhGhwYzaqxZSpRAAzmDL3GRfnrPqxUxw7yjMTRwlxfp7JdeklG3/lnmF6KEevr7OGaJYmhU4j1gS92UXvZfTiqgKQQUmoixfFNLhxW01mA5dEliVrSwms+MBtlAQgZh7b7sqSr9bOVdtSlfr7S28gLQcxguXMJelq1S6vSPhm9dGM2qsc+VLISkVkwZe4yL7Mp9WKmOGdJfmjW4v04rw7hgHSLKTohjUHF4VsliaFTqIDF2EYKkzCajAUghSTURznxDfOnFbTWYDl0yWZatMun1gNsoCEDMOMofSGdQfayvHuGED6cYtuoC0GsGC7ctRdl61S6vSKEG8eGM2qscyVLISkVkwWLjowVKmFVCOFcJfmjW6vmDDHlp+1lf1D9oHMcImlmZFTqIDF2EcmpMwmo+MBbagpJqI48sZ1azc1RoITgvT9YS8wAmUXQlxIqToVzKj9IZ1B9rK9qGEH6cypx0BUm1SlANSznV6RMmRcWLnINFBwhR+nHWw6OSobIeuVP4XGhQKeuiFSTxpKBS0o9ZH+RzDx7hhI0CyqGkQye4OYTJMGhxwUrUOoiGblSAoddF7g6iIQw1ip/XmETspgmpfCO8NENTUqQmYRykfRWdJhLicGYpNaTnHHWO1QnaaLOlPZJTsPHU6vNmGc6IenJzC+5yleOZIhc/N5VMYdVOjmuEGCQmjyu4qPeRkz1Ad7pzK9OOwjS59sPpZ5hOhynaKePw38swaG+8vOr8oprkJU76ubWw7iqGyHrlT4pdaF7h66IVJPGlbYpbUeuj9uMgdhBO3/TZ1jtoB2f9HGTJsGh13GUOojOYZuXc8UPOi9wdRMIYaqTn0nnET0plUvh1k6IZm5TA+jlI8c6TCXUYKawawdHFmVpNNCuD2D97PLuKNHKvNv/AAcVbrlSf1+kPTs706+UofZIhd0JvKZjCO6nnqapCaO4qOHGTPmh3uqzK9pcmFhCBpi9lKZWSzunGV4QfNNnOuIAmaZqR/EGMiA5LrC0+3hP5aXNCO+vT+UUVyEqd9XPrYdqVn0Q9cufFLzQvcPXRCpJ80uNClCj10aY93k0e8zZ6qah4wJm7C+GdzNdVMUCqFeaqznXTAp0QZm5C+Aezt9VUe7zyPdpsdVVR8IRKS5oedrV2EZzDNzLnih50XoA6qdMIYbqFZ0mwIuhKZTL4dZMNraR7pLJ/i9Y6aIvZdGHOo1n2q81VnOumB7LyYRToVnELccQZuVV/E6yQKoXdGbyh/FHZTYsHEV5qrOddMC1K81VnOumBaleaqznXTAtSvNVZzrpgWpXmqs510wLUrzVWc66YFqV5qrOddMC1K81VnOumBaleaqznXTAtSvNVZzrpgWpXmqs510wLUrzVWc66YFqV5qrOddMC1K81VnOumBaleaqznXTAtSvNVZzrpgWpSH320K4QmgmMrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oytnejK2d6MrZ3oKGX21rvxgBgWpV+pIPCqrMY7e2MdvbGO3tjHb2xjt7Yx29sY7e2MdvbGO3tjHb2xjt7Yx29sY7e2MdvbGO3tjHb2xjt7Yx29sY7e2MdvbGO3tjHb2wbxSSb8VGBauiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvmOiVvn+35//xAArEAABAgIKAgMBAQEBAAAAAAABABEx8CFAQVFhcYGhwfGRsRAgMNHhkFD/2gAIAQEAAT8h/wCTpUD2ODNv5nIizP8A4jKKilxQyC+pZWpPBttQibgrljuej3FQ8SByN0vKOQVq/wB40YGwCeE9jYBLPKKpxEGdA0IdhqrpMX+1Kv8AmkhvDpnuwa6CUCckYBO6sRJfyrFkue1HKvmxbb0K/wCqSfTJnOwfgxNnMj4gRaVoR+c6597UozMRK+hOSFEcuRaf4EcvwH8kBcCyPCGuS5F4Ty4T+hGhMmSxajlCgGkAZXhf43ZmoGQpV8+FDPcCwLvjCKgUuKWQG0Lq1I4e8pVkFLFPCxA4nhCxo5DgisOjES0+U427o07oIx0AgsiD5gH7orAHwKGUGHxvsFQgxY+H2mI+4N5AhG43J9odphzfSNYFwryQAoKwwfL7Vo/EGmWpalQowNAPuzvBBZADy5H0fd3kSUZ5OH9qqLGzkjAJja0AeCdCnAiiTGUfjNA6H9jV8KEPQctvwO0t6MSfZUlhQE+ZOiDRRyHBqQnm4fyT6POTSJChzuH8yeML7PV5KhNtm+YjiRuE5VTi5EpKMgW6L+37hIg5DAKgsKCbInRHtLenEH0+uN3pWCYaq5Nh01JW+ohTBohfG9NviLK+fOiE/NyHBH6CQLfF/JOFU4sTKQoDqRsPtjUQRub6qsIC7LAwRt9qM1IbhGFIubtLXNFZlxf9vxE/NyGACffAWVsudEYUwaYXwu/DbKeXKrI7y2Y/AFPSNEL43p0QZZ3mdIGg3LcH7t6yPM9q/wAq1Ws1hxnQ2fjgERQMG71qqDK8OyxgE7fjla2ccoUhqU4kx3IqXyv+7nptiVhCYEDlm6tskUr4aP0HQ2/hhUXYrDsFVxxAsbvT+BZNtJanMwH+ICIYViTZ0JWhjaVpP4XVjtXF3eiWhpDC8Aw1BQAyZeCGgmIP3pA2vCcqvNCIOPu76QNEQ0AxJTyBQkGOzCHkqnktGh6bfkF0AFl/Nj3KixUOyDq0FofvlqPgeCr5pA0PYn7xSk+4hZEAxcrQGu/nxn+YNYJ7SsIQ8RoLHRsyOHtgLE5wHQ2/bOQ5kAPVXYE1UiD9gvsQmM9wYDHJDGAhGpPvdC0oqbVsT+lHNYdT23QNEH0hhtBh4KFIYEEoliD9RdRBQspPZVcXkXmTh/v1H+moCJWBiTQmhIaNvrQ8lHhXoA6Q9bftDbVu/nxkrnAXUPIMDofm06xayvRgGFDoZWeULDu4awMEDZoZjOqIVN0RgRZ8xuk24DQcsAxe5Q21rv58Z/uHyiotFYQggiTdAfDbImm2Asswgf8AU8ZQBT5qdFaUYXjxmKANgABgBYpBhWBCAgcGkCrRqbW1nrJOKUSBnp1RCopIu5sGOSKDA2uftTmVBtcS2NQFatSANYe90e25YjHDBg2VE4V+zz8GCkGFYFt/hkAhCoyym2kAIm6Bw2QD3pSaYG2jVIAAAMBYPkwUgwrAtv8AJAAghwUKBRVTBSDCsC29ZMFIMKwLb1kwUgwrAtvWTBSDCsC29ZMFIMKwLb1kwUgwrAtvWTBSDCsC29ZMFIMKwLb1kwUgwrAtvWTBSDCsC29ZMFIMKwLb1kwUgwrAtvWTBSDCsC29ZMFIMKwLb1kwUgwrAtvWTBQkLzLULqC6guoLqC6guoLqC6guoLqC6guoLqC6guoLqC6guoLqC6guoLqCdjpp5ZbesmCEUCAMF1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VAaBMDrb1olJJlMVJnKkzlSZypM5UmcqTOVJnKkzlSZypM5UmcqTOVJnKkzlSZypM5UmcqTOVJnKkzlSZypM5UmcoBgALP+ff/9oADAMBAAIAAwAAABDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzTCgjjTDhAzjDTzzzzzzzzzzzhzzzyyyzwzzzzxDTzzzzzzzBTzjzzzzzzzzzzjTxzTzzzzyRzzyhzzzzzzzzzyhTzxzTTzzzTzzzhTzzzzzzzzyxTzzyzTzzwxzzzzzzzzzzzzzzzzzyyzzzzywjzzzzzzzzzzzzzzzzizzzzzzzzjwjzzzzzzzzzzwTjiTzzzzzzwRwDzzzzzzzzzzwCyjzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwDzzzzzzzzzzzwDzzzzzzzzzzwjzzzzzzzzzzzxgwwwwwwwwwwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAwEBPxBOf//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQIBAT8QTn//xAAqEAEAAQMCBQQDAQADAAAAAAABEQAhMUFRQGFxofCBkbHBECAwkFDR4f/aAAgBAQABPxD/ACdNBsnE/wABqrEkt/5mSXIlJ3NFJhEb/wDCWlRMznSW9LF+0utiA+i1iaODjefxWgxmqkbb0FhECN0KES0WaMebbN9nAw0lhh2TI8mH9y0LJXrH4o3ak7UDWMf+KAVcV0CR3uBAhgXSTDXlg7xn7xRDBMsObAesVZWMzGdYbcavfAgBlVwU+wJLDrCepNYuPGIN5z9qZqZQ27Rn7zUwRvLDzIH1mrBxiJzrBf8AAtIJAb6JITPJBoseYnxoZ5AmIc1dwslyzOxyuU0ADZDdItQkdssw+pe1H+Q1O9XkC0Y7VmXLI39w9qD0XuEbGLtR5TypmwEKdDmGnAKWRzZLGbz21p26gw49QkA6sqv4tKiLM6SWpZlWXXKAegVmaMCjafxCsPPjFTeM+1A0WsIh6yj1igdKIJYRMnEHWn1S0jQc0HVtUfMFwdFtz1J2yVdaB8EMpdi6Lf8AcfwYKNzGrsI0Z5BAchDarbKiWffnQVbgd8ZFmnSXXO+xQh0Rd9ytkJqfir1lDYMnvXoim8zcynMI+i7UWhYI9Mfud4S+UF9knAS9JFSLA6ry+l9zKpcy6rmbaJ1PWG3CogYMCZVbBUiAW5z5ELzZnTJTHsjIzMdUvQt+LXYOhYfYevD3Yj0Rndw/BSodKGBHqs80tV9iT7mIlnmAmozQbNFguESycEvOXVdxbROr6S2qBEyYOi8nrfYyo2cxEHV3Xdu/llhL0kbw4gCXltz4J+R9+iYOfJ5lykF9JBuV5XpfcqSY4ueZtoHU9Yx/dFsiwTKrYKdjJLuYmXeaK6LNO1DrQwZ9V3mFv1j4lhdZx3oi8E+pPCnjivoE1ZWEZ6pXu/q4ENMWIkeqzz0pO08Xo4WeYCa6qDjAu9qJZP6FmOLnuLaHd9JxQSuEo9F5HrfYqfXoiDnzebd/Yl8e/DTo5X7jhWIz7Q6gex7cP2EF1wh/3zyVKGAVjVer0plBIXQMwaB1Mahj+KcYFztVbBSZ3kvq5d5orpqpwIa4sxZ9V3np/Dvnxw7A54rb+GkFZsYiR6pE0dKQ9LB6EGeYDus0JDhEbqJn9y2a8XG6MFyyACIuMm7MwCbXH1FJlQyfwJjHtg0j+Q8KOHn3R1BmPeh/F4gB5jrTDcO8WlNvqi7MTwDgvEGcP2l0U05jmhBOlGK4JlJAE5BHqN1TvOFLNAXVY3j+AjlhM6lWivbwOFkXHuIlXClU9Y/wUjJKBMG6P66tD3SFoiFdpB5w1JUL2Cshd+aWXtp/AUFU5lCVDZKhqIpsJDkoRtqtzQFPFjJgg9AJ6Tr+4c64egFUz0n93H8cDSxBdUAG7UhlGVJCNmz7Gihm2iFoSNJBRoAyP8kELPOc6C69Q00h1AWz45MuPxP72o585fP8OG+4hy8Jafuxoyu4U7BuP2RQZWB7ts/RU/lNdiCTl80MPaieUN6yCJzCOctQ0UuT0yoR1b9sQj1OXuwfDuFQK59mP2Em3VYscmbrp1UyFo4BIR0kLswLMVrTHEIvzS+xBp/QOZ8ASlKxrAqNRGpSNbFiiHbcrk6BRBIo0LQfQCPT9TAxlyQkdY/pw6CKowIqHr+sahTA5ewHVADdpWnDhUIVsXqXWawzMGWIzSQs0AZn+0jwUffcrvc1YSQ8MiNmWX35351rKV1sMrkS043LGNcAbHVG+irlLBly24f4fdq2PwSdKFbhzY2GK1G/u7uLrk/naHncOanW1amyk64L9ts/Q1AAAt/bHeYEjvzQ354w0/8A0PIhAbwrswrM0Gui0pYZ1f1waTNZekbhtqGNWkV1ulrNhboLb6qCw1BADAGhXhtuH+C3aOIIAkSMNTk+4bWdiW0cmqhzQldOim+g50aZmJgghy1PPU6qSWREWoR0UNyDMFBvMpSE5ea+xBpwGlx8lGZwzA2aiNqLD8mgmIiWWgugVUAjtKEBO+xyIDb8ZuleG24f4LdrsPx+Ex0csb6fRkdRoNgOEYktYM43TIsViNsMkXmJD0NS8CgiJahKCgCAPzm6V4bbh/gt2uw/H5IsCESRKAAACwGnC5uleG24f4LdrsPxxObpXhtuH+C3a7D8cTm6V4bbh/gt2uw/HE5uleG24f4LdrsPxxObpXhtuH+C3a7D8cTm6V4bbh/gt2uw/HE5uleG24f4LdrsPxxObpXhtuH+C3a7D8cTm6V4bbh/gt2uw/HE5uleG24f4LdrsPxxObpXhtuH+C3a7D8cTm6V4bbh/gt2uw/HE5uleG24f4LdrsPxxObpXhtuH+C3a7D8cTm6V4bbh/gt2uw/HE5ulOM8LTCDDpZ4f7777777777777777777775weCJgssFdh+OJzdKnC0hGI315r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r915r91L1rKQl2rsPxxLcim4lZeI0aNGjRo0aNGjRo0aNGjRo0aNGjRixgQf59//2Q==';
                    var productItem = `
                        <div class="col-md-4" data-product-id="${product.id}" data-category="${product.category_name.toLowerCase()}">
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

                filterProducts(); // Call filterProducts after loading products
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

function loadProductsForEdit() {

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
                var productTableBody = $('#productTableBody');

                productTableBody.empty();

                // Load categories once to use for all products
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
                    success: function (catResponse) {
                        if (catResponse.status === 'success') {
                            var categories = catResponse.data;

                            products.forEach(function (product) {
                                var imageFilename = product.image ? 'Current image: ' + product.image.substring(0, 30) + '...' : 'No image available';
                                var categoryOptions = categories.map(category => {
                                    var selected = category.id == product.category_id ? 'selected' : '';
                                    return `<option value="${category.name}" ${selected}>${category.name}</option>`;
                                }).join('');

                                var row = `
                                    <tr>
                                        <td>${product.id}</td>
                                            <td><input type="text" class="form-control" value="${product.name}" id="name-${product.id}" disabled></td>
                                            <td><input type="text" class="form-control" value="${product.description}" id="description-${product.id}" disabled></td>
                                            <td><input type="number" class="form-control" value="${product.price}" id="price-${product.id}" disabled></td>
                                            
                                        <td>
                                            <select class="form-control" id="category-${product.id}" disabled>
                                                ${categoryOptions}
                                            </select>
                                        </td>

                                        <td>
                                            <span id="current-image-${product.id}">${imageFilename}</span>
                                                <input type="file" class="form-control mt-2" id="image-${product.id}" disabled>  <!-- Ensure this is disabled initially -->
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
                            alert('Failed to load categories: ' + catResponse.message);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Error loading categories.', textStatus, errorThrown);
                        alert('Error loading categories. Please try again.');
                    }
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
    $('#image-' + productId).prop('disabled', false);  // Enable the image file input
    $('.edit-btn[data-product-id="' + productId + '"]').hide();
    $('.save-btn[data-product-id="' + productId + '"]').show();
}



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

    $('#productList .col-md-4').each(function () {
        var productText = $(this).text().toLowerCase();
        var productCategory = $(this).data('category').toLowerCase();
        var matchesSearch = productText.indexOf(searchValue) > -1;
        var matchesCategory = categoryValue === 'all' || productCategory === categoryValue;

        $(this).toggle(matchesSearch && matchesCategory);
    });
}

function loadCategoriesForFilter() {
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
            if (response.status === 'success') {
                var categories = response.data;
                var categorySelect = $('#categoryFilter');

                categories.forEach(function (category) {
                    var option = $('<option></option>').attr('value', category.name.toLowerCase()).text(category.name);
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




