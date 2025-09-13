// Funciones para manejar la autenticación y sesión de usuario

// Verificar si hay un usuario con sesión iniciada
function verificarSesion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    return usuarioActual !== null;
}

// Obtener datos del usuario actual
function obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
}

// Guardar sesión de usuario
function guardarSesion(usuario) {
    // Eliminamos la contraseña por seguridad antes de guardar en localStorage
    const usuarioSesion = { ...usuario };
    delete usuarioSesion.password;
    
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioSesion));
}

// Exponer funciones al objeto window para que sean accesibles desde otros scripts
window.guardarSesion = guardarSesion;

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
}

// Actualizar la interfaz según el estado de la sesión
function actualizarInterfazUsuario() {
    const userActionsContainer = document.getElementById('user-actions');
    
    if (!userActionsContainer) return;
    
    if (verificarSesion()) {
        const usuario = obtenerUsuarioActual();
        userActionsContainer.innerHTML = `
            <a href="mi-cuenta.html" class="btn-secondary">
                <i class="fas fa-user"></i> Mi Cuenta
            </a>
            <a href="carrito.html" class="cart-link">
                <i class="fas fa-shopping-cart"></i> Carrito (<span id="cart-count">0</span>)
            </a>
        `;
    } else {
        userActionsContainer.innerHTML = `
            <a href="login.html" class="btn-secondary">Iniciar Sesión</a>
            <a href="registro.html" class="btn-primary">Registrarse</a>
            <a href="carrito.html" class="cart-link">
                <i class="fas fa-shopping-cart"></i> Carrito (<span id="cart-count">0</span>)
            </a>
        `;
    }
}

// Proteger página de Mi Cuenta
function protegerPaginaCuenta() {
    // Si estamos en la página mi-cuenta.html y no hay sesión, redirigir al login
    if (window.location.pathname.includes('mi-cuenta.html') && !verificarSesion()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Si estamos en la página mi-cuenta.html y hay sesión, cargar los datos del usuario
    if (window.location.pathname.includes('mi-cuenta.html') && verificarSesion()) {
        const usuario = obtenerUsuarioActual();
        
        // Actualizar la información del perfil
        document.getElementById('user-name').textContent = usuario.nombre;
        document.getElementById('user-email').textContent = usuario.email;
        
        // Actualizar la información personal
        document.getElementById('info-nombre').textContent = usuario.nombre;
        document.getElementById('info-run').textContent = usuario.run;
        document.getElementById('info-email').textContent = usuario.email;
        document.getElementById('info-telefono').textContent = usuario.telefono || 'No especificado';
        
        // Actualizar la información de dirección
        document.getElementById('info-region').textContent = usuario.region;
        document.getElementById('info-comuna').textContent = usuario.comuna;
        document.getElementById('info-direccion').textContent = usuario.direccion;
        
        // Configurar el botón de cerrar sesión
        document.getElementById('logout-btn').addEventListener('click', cerrarSesion);
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    actualizarInterfazUsuario();
    protegerPaginaCuenta();
});