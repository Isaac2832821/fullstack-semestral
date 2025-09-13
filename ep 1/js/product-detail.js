/**
 * product-detail.js - Funcionalidad para la página de detalle de producto
 */

// Función para obtener el ID del producto de la URL
function obtenerProductoIdDeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Función para crear el HTML del detalle del producto
function crearHTMLDetalleProducto(producto) {
    return `
        <div class="product-detail-container">
            <div class="product-detail-left">
                <div class="product-detail-image">${producto.imagen}</div>
                <div class="product-thumbnails">
                    <div class="thumbnail">${producto.imagen}</div>
                    <div class="thumbnail">${producto.imagen}</div>
                    <div class="thumbnail">${producto.imagen}</div>
                </div>
            </div>
            <div class="product-detail-right">
                <h1 class="product-title">${producto.nombre}</h1>
                <p class="product-price">${formatearPrecio(producto.precio)}</p>
                
                <div class="product-description">
                    <p>${producto.descripcion}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Disponible en una variedad de colores, tamaños y opciones. Las manzanas son una opción perfecta para cualquier ocasión, ya sea como un refrigerio saludable.</p>
                </div>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <label for="quantity">Cantidad</label>
                        <div class="quantity-input">
                            <button type="button" class="quantity-btn minus" id="quantity-minus">-</button>
                            <input type="number" id="quantity" name="quantity" value="1" min="1" max="${producto.stock}">
                            <button type="button" class="quantity-btn plus" id="quantity-plus">+</button>
                        </div>
                    </div>
                    
                    <button class="btn-primary add-to-cart-detail" id="add-to-cart-btn" data-id="${producto.id}">
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar productos relacionados
function mostrarProductosRelacionados(producto) {
    // Obtener productos de la misma categoría, excluyendo el producto actual
    const relacionados = productos
        .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
        .slice(0, 5); // Mostrar máximo 5 productos relacionados
    
    const container = document.getElementById('related-products');
    if (!container) return;
    
    if (relacionados.length === 0) {
        container.innerHTML = '<p>No hay productos relacionados disponibles.</p>';
        return;
    }
    
    container.innerHTML = relacionados.map(crearTarjetaProducto).join('');
    
    // Agregar event listeners para botones de añadir al carrito
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            añadirAlCarrito(productId);
        });
    });
}

// Función para inicializar la página de detalle
function inicializarPaginaDetalle() {
    const productoId = obtenerProductoIdDeURL();
    if (!productoId) {
        document.getElementById('product-detail').innerHTML = '<p>Producto no encontrado</p>';
        return;
    }
    
    const producto = obtenerProductoPorId(parseInt(productoId));
    if (!producto) {
        document.getElementById('product-detail').innerHTML = '<p>Producto no encontrado</p>';
        return;
    }
    
    // Actualizar título de la página
    document.title = `${producto.nombre} - Tienda Online`;
    
    // Actualizar breadcrumb
    const breadcrumbProductName = document.getElementById('breadcrumb-product-name');
    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = producto.nombre;
    }
    
    // Mostrar detalle del producto
    const detailContainer = document.getElementById('product-detail');
    if (detailContainer) {
        detailContainer.innerHTML = crearHTMLDetalleProducto(producto);
        
        // Configurar controles de cantidad
        const quantityInput = document.getElementById('quantity');
        const minusBtn = document.getElementById('quantity-minus');
        const plusBtn = document.getElementById('quantity-plus');
        
        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue < producto.stock) {
                    quantityInput.value = currentValue + 1;
                }
            });
        }
        
        // Configurar botón de añadir al carrito
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const cantidad = parseInt(quantityInput.value);
                if (cantidad > 0 && cantidad <= producto.stock) {
                    añadirAlCarrito(producto.id, cantidad);
                }
            });
        }
    }
    
    // Mostrar productos relacionados
    mostrarProductosRelacionados(producto);
}

// Función para añadir al carrito (reutilizando la del carrito)
function añadirAlCarrito(productoId, cantidad = 1) {
    const carrito = new CarritoCompras();
    carrito.añadirProducto(productoId, cantidad);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarPaginaDetalle);