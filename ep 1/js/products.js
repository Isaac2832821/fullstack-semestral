// Base de datos de productos simulada
const productos = [
    {
        id: 1,
        nombre: "Producto #1",
        precio: 8000,
        descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        categoria: "electronica",
        stock: 10,
        imagen: "📱"
    },
    {
        id: 2,
        nombre: "Producto #2",
        precio: 6000,
        descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        categoria: "ropa",
        stock: 15,
        imagen: "👕"
    },
    {
        id: 3,
        nombre: "Producto #3",
        precio: 10000,
        descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        categoria: "hogar",
        stock: 8,
        imagen: "🏠"
    },
    {
        id: 4,
        nombre: "Smartphone Galaxy",
        precio: 299990,
        descripcion: "Smartphone de última generación con cámara de 108MP",
        categoria: "electronica",
        stock: 5,
        imagen: "📱"
    },
    {
        id: 5,
        nombre: "Camiseta Deportiva",
        precio: 25990,
        descripcion: "Camiseta deportiva de alta calidad, transpirable",
        categoria: "ropa",
        stock: 20,
        imagen: "👕"
    },
    {
        id: 6,
        nombre: "Lámpara LED",
        precio: 45990,
        descripcion: "Lámpara LED inteligente con control remoto",
        categoria: "hogar",
        stock: 12,
        imagen: "💡"
    }
];

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
}

// Función para crear tarjeta de producto
function crearTarjetaProducto(producto) {
    return `
        <div class="product-card" data-id="${producto.id}">
            <div class="product-image">${producto.imagen}</div>
            <h3>${producto.nombre}</h3>
            <p class="product-price">${formatearPrecio(producto.precio)}</p>
            <p>${producto.descripcion}</p>
            <div class="product-actions">
                <button class="btn-primary add-to-cart" data-id="${producto.id}">
                    Añadir al Carrito
                </button>
                <a href="producto.html?id=${producto.id}" class="btn-secondary">
                    Ver Detalles
                </a>
            </div>
        </div>
    `;
}

// Función para mostrar productos
function mostrarProductos(productosAMostrar = productos) {
    const grid = document.getElementById('products-grid') || document.getElementById('featured-products');
    if (!grid) return;
    
    if (productosAMostrar.length === 0) {
        grid.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }
    
    grid.innerHTML = productosAMostrar.map(crearTarjetaProducto).join('');
    
    // Agregar event listeners para botones de añadir al carrito
    grid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            añadirAlCarrito(productId);
        });
    });
}

// Función para obtener producto por ID
function obtenerProductoPorId(id) {
    return productos.find(producto => producto.id === parseInt(id));
}

// Función para filtrar productos
function filtrarProductos() {
    const categoriaFiltro = document.getElementById('category-filter')?.value || '';
    const precioFiltro = document.getElementById('price-filter')?.value || '';
    
    let productosFiltrados = productos;
    
    // Filtrar por categoría
    if (categoriaFiltro) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.categoria === categoriaFiltro
        );
    }
    
    // Filtrar por precio
    if (precioFiltro) {
        const [min, max] = precioFiltro.split('-').map(Number);
        productosFiltrados = productosFiltrados.filter(producto => {
            if (precioFiltro.includes('+')) {
                return producto.precio >= min;
            }
            return producto.precio >= min && producto.precio <= max;
        });
    }
    
    mostrarProductos(productosFiltrados);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar productos destacados en home (solo 3)
    if (document.getElementById('featured-products')) {
        mostrarProductos(productos.slice(0, 3));
    }
    
    // Mostrar todos los productos en página de productos
    if (document.getElementById('products-grid')) {
        mostrarProductos();
        
        // Agregar event listeners para filtros
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filtrarProductos);
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', filtrarProductos);
        }
    }
});