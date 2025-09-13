// Gestión del carrito de compras
class CarritoCompras {
    constructor() {
        this.items = this.cargarCarrito();
        this.actualizarContador();
    }
    
    // Cargar carrito desde localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }
    
    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
        this.actualizarContador();
    }
    
    // Añadir producto al carrito
    añadirProducto(productoId, cantidad = 1) {
        const producto = obtenerProductoPorId(productoId);
        if (!producto) {
            console.error('Producto no encontrado');
            return false;
        }
        
        const itemExistente = this.items.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({
                id: productoId,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad,
                imagen: producto.imagen
            });
        }
        
        this.guardarCarrito();
        this.mostrarMensaje(`${producto.nombre} añadido al carrito`);
        return true;
    }
    
    // Remover producto del carrito
    removerProducto(productoId) {
        const productoEliminado = this.items.find(item => item.id === productoId);
        if (productoEliminado) {
            const nombreProducto = productoEliminado.nombre;
            this.items = this.items.filter(item => item.id !== productoId);
            this.guardarCarrito();
            this.mostrarMensaje(`${nombreProducto} eliminado del carrito`);
        }
    }
    
    // Actualizar cantidad de producto
    actualizarCantidad(productoId, nuevaCantidad) {
        const item = this.items.find(item => item.id === productoId);
        if (item) {
            if (nuevaCantidad <= 0) {
                this.removerProducto(productoId);
            } else {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
            }
        }
    }
    
    // Obtener total del carrito
    obtenerTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }
    
    // Obtener cantidad total de items
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }
    
    // Actualizar contador en el header
    actualizarContador() {
        const contador = document.getElementById('cart-count');
        if (contador) {
            contador.textContent = this.obtenerCantidadTotal();
        }
    }
    
    // Limpiar carrito
    limpiarCarrito() {
        this.items = [];
        this.guardarCarrito();
    }
    
    // Mostrar mensaje temporal
    mostrarMensaje(mensaje) {
        // Crear elemento de mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'cart-message';
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(mensajeDiv);
        
        // Remover mensaje después de 3 segundos
        setTimeout(() => {
            mensajeDiv.remove();
        }, 3000);
    }
    
    // Renderizar carrito en la página de carrito
    renderizarCarrito() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartElement = document.getElementById('empty-cart');
        const cartSummaryElement = document.getElementById('cart-summary');
        
        if (!cartItemsContainer) return;
        
        // Limpiar contenedor
        cartItemsContainer.innerHTML = '';
        
        // Mostrar mensaje de carrito vacío si no hay items
        if (this.items.length === 0) {
            if (emptyCartElement) emptyCartElement.style.display = 'block';
            if (cartSummaryElement) cartSummaryElement.style.display = 'none';
            return;
        }
        
        // Ocultar mensaje de carrito vacío y mostrar resumen
        if (emptyCartElement) emptyCartElement.style.display = 'none';
        if (cartSummaryElement) cartSummaryElement.style.display = 'block';
        
        // Crear elementos para cada item del carrito
        this.items.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            const imageSrc = item.imagen || 'placeholder.jpg';
            
            cartItemElement.innerHTML = `
                <div class="item-image">
                    <img src="${imageSrc}" alt="${item.nombre}">
                </div>
                <div class="item-details">
                    <h3>${item.nombre}</h3>
                    <p class="item-price">$${item.precio.toLocaleString()}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="item-total">
                    <p>$${(item.precio * item.cantidad).toLocaleString()}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Actualizar totales
        this.actualizarTotales();
        
        // Añadir event listeners para botones
        this.añadirEventListeners();
    }
    
    // Actualizar totales en el resumen del carrito
    actualizarTotales() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const totalElement = document.getElementById('cart-total');
        
        if (!subtotalElement || !taxElement || !totalElement) return;
        
        const subtotal = this.obtenerTotal();
        const tax = subtotal * 0.19; // IVA 19%
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        taxElement.textContent = `$${tax.toLocaleString()}`;
        totalElement.textContent = `$${total.toLocaleString()}`;
    }
    
    // Añadir event listeners para los botones del carrito
    añadirEventListeners() {
        // Botones de incremento/decremento de cantidad
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = this.items.find(item => item.id === id);
                if (item && item.cantidad > 1) {
                    this.actualizarCantidad(id, item.cantidad - 1);
                    this.renderizarCarrito();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.actualizarCantidad(id, item.cantidad + 1);
                    this.renderizarCarrito();
                }
            });
        });
        
        // Botones de eliminar producto
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = btn.dataset.id;
                console.log('Eliminando producto con ID:', id);
                this.removerProducto(id);
                this.renderizarCarrito();
            });
        });
        
        // Botón de checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                // Verificar si hay productos en el carrito
                if (this.items.length === 0) {
                    alert('No hay productos en el carrito');
                    return;
                }
                
                // Crear una nueva venta
                const nuevaVenta = {
                    id: null, // Se generará automáticamente
                    nombre: 'Cliente Web', // Podría obtenerse del usuario logueado
                    estado: 'pending',
                    monto: this.obtenerTotal(),
                    fecha: null, // Se establecerá automáticamente
                    productos: [...this.items] // Guardar copia de los productos
                };
                
                // Verificar si existe la función para agregar ventas
                if (typeof agregarVenta === 'function') {
                    // Agregar la venta (esto también actualiza localStorage)
                    agregarVenta(nuevaVenta);
                    
                    // Limpiar el carrito
                    this.limpiarCarrito();
                    
                    // Mostrar mensaje de éxito
                    this.mostrarMensaje('¡Compra realizada con éxito! Tu pedido está en proceso.');
                    
                    // Redirigir a la página de confirmación después de un breve retraso
                    setTimeout(() => {
                        window.location.href = 'confirmacion.html';
                    }, 2000);
                } else {
                    // Fallback si no existe la función
                    alert('¡Gracias por tu compra! Tu pedido ha sido registrado.');
                    this.limpiarCarrito();
                }
            });
        }
    }
    
    // Mostrar productos relacionados
    mostrarProductosRelacionados() {
        const relatedProductsContainer = document.getElementById('related-products');
        if (!relatedProductsContainer) return;
        
        // Obtener algunos productos aleatorios (simulado)
        const productos = window.productos || [];
        if (productos.length === 0) return;
        
        // Mostrar hasta 4 productos aleatorios
        const productosAleatorios = [...productos]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        relatedProductsContainer.innerHTML = '';
        
        productosAleatorios.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.className = 'product-card';
            
            productoElement.innerHTML = `
                <div class="product-image">
                    <img src="${producto.imagen || 'placeholder.jpg'}" alt="${producto.nombre}">
                </div>
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <p class="product-price">$${producto.precio.toLocaleString()}</p>
                    <button class="btn-secondary add-to-cart" data-id="${producto.id}">
                        <i class="fas fa-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            `;
            
            relatedProductsContainer.appendChild(productoElement);
        });
        
        // Añadir event listeners para botones de añadir al carrito
        document.querySelectorAll('#related-products .add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.añadirProducto(id);
                this.renderizarCarrito();
            });
        });
    }
}

// Instancia global del carrito
const carrito = new CarritoCompras();

// Función global para añadir al carrito (usada por products.js)
function añadirAlCarrito(productoId, cantidad = 1) {
    return carrito.añadirProducto(productoId, cantidad);
}

// CSS para animación del mensaje
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border);
        position: relative;
    }
    
    .item-image {
        width: 80px;
        height: 80px;
        margin-right: 1rem;
        border-radius: var(--border-radius-sm);
        overflow: hidden;
    }
    
    .item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .item-details {
        flex: 1;
    }
    
    .item-details h3 {
        margin: 0 0 0.5rem;
        font-size: 1rem;
    }
    
    .item-price {
        color: var(--text-light);
        margin: 0;
    }
    
    .item-quantity {
        display: flex;
        align-items: center;
        margin: 0 1.5rem;
    }
    
    .quantity-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: all var(--transition-fast);
    }
    
    .quantity-btn:hover {
        background: var(--light);
    }
    
    .item-quantity span {
        margin: 0 0.5rem;
        min-width: 20px;
        text-align: center;
    }
    
    .item-total {
        font-weight: 600;
        margin-right: 1rem;
        min-width: 80px;
        text-align: right;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: var(--danger);
        cursor: pointer;
        font-size: 1rem;
        padding: 0.5rem;
        transition: all var(--transition-fast);
    }
    
    .remove-item:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);