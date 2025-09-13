/**
 * admin.js - Funcionalidad para el panel de administración
 */

// Datos de ejemplo para los informes
const datosInformes = {
    ventas: [
        { fecha: '2023-01-01', cliente: 'Empresa A', producto: 'Laptop HP', cantidad: 5, total: 4500 },
        { fecha: '2023-01-05', cliente: 'Empresa B', producto: 'Monitor Dell', cantidad: 10, total: 2000 },
        { fecha: '2023-01-10', cliente: 'Empresa C', producto: 'Teclado Logitech', cantidad: 20, total: 1000 },
        { fecha: '2023-01-15', cliente: 'Empresa A', producto: 'Mouse Logitech', cantidad: 15, total: 450 },
        { fecha: '2023-01-20', cliente: 'Empresa D', producto: 'Impresora HP', cantidad: 3, total: 900 }
    ],
    clientes: [
        { id: 'C001', nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '912345678', fechaRegistro: '2022-10-15', compras: 12 },
        { id: 'C002', nombre: 'María López', email: 'maria@example.com', telefono: '923456789', fechaRegistro: '2022-11-20', compras: 8 },
        { id: 'C003', nombre: 'Carlos Gómez', email: 'carlos@example.com', telefono: '934567890', fechaRegistro: '2022-12-05', compras: 5 },
        { id: 'C004', nombre: 'Ana Martínez', email: 'ana@example.com', telefono: '945678901', fechaRegistro: '2023-01-10', compras: 3 },
        { id: 'C005', nombre: 'Pedro Rodríguez', email: 'pedro@example.com', telefono: '956789012', fechaRegistro: '2023-01-15', compras: 1 }
    ],
    productos: [
        { codigo: 'P001', nombre: 'Laptop HP', categoria: 'Computadoras', stock: 15, precio: 900, ventas: 25 },
        { codigo: 'P002', nombre: 'Monitor Dell', categoria: 'Periféricos', stock: 30, precio: 200, ventas: 50 },
        { codigo: 'P003', nombre: 'Teclado Logitech', categoria: 'Periféricos', stock: 45, precio: 50, ventas: 100 },
        { codigo: 'P004', nombre: 'Mouse Logitech', categoria: 'Periféricos', stock: 60, precio: 30, ventas: 120 },
        { codigo: 'P005', nombre: 'Impresora HP', categoria: 'Impresoras', stock: 10, precio: 300, ventas: 15 }
    ],
    ingresos: [
        { mes: 'Enero', ventas: 45000, gastos: 30000, beneficio: 15000 },
        { mes: 'Febrero', ventas: 50000, gastos: 32000, beneficio: 18000 },
        { mes: 'Marzo', ventas: 55000, gastos: 35000, beneficio: 20000 },
        { mes: 'Abril', ventas: 60000, gastos: 36000, beneficio: 24000 },
        { mes: 'Mayo', ventas: 65000, gastos: 38000, beneficio: 27000 }
    ]
};

// Cargar ventas desde localStorage o inicializar con un array vacío
let usuarios = cargarVentasDesdeLocalStorage() || [];

// Función para cargar ventas desde localStorage
function cargarVentasDesdeLocalStorage() {
    const ventasGuardadas = localStorage.getItem('ventas');
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : null;
}

// Función para guardar ventas en localStorage
function guardarVentasEnLocalStorage() {
    localStorage.setItem('ventas', JSON.stringify(usuarios));
}

// Función para formatear montos
function formatearMonto(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(monto);
}

// Función para generar un ID único
function generarId() {
    const prefix = 'ID';
    const numero = Math.floor(7000 + Math.random() * 3000);
    return `${prefix}${numero}`;
}

// Función para añadir una nueva venta
function agregarVenta(venta) {
    // Generar ID si no tiene uno
    if (!venta.id) {
        venta.id = generarId();
    }
    
    // Establecer fecha actual si no tiene una
    if (!venta.fecha) {
        const hoy = new Date();
        venta.fecha = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    
    // Añadir al array de usuarios (ventas)
    usuarios.unshift(venta); // Añadir al principio para que aparezca primero
    
    // Guardar en localStorage
    guardarVentasEnLocalStorage();
    
    // Actualizar la interfaz
    cargarUsuarios();
    
    // Si estamos en la página de pedidos, actualizar la tabla
    const tablaPedidos = document.getElementById('tabla-pedidos');
    if (tablaPedidos) {
        cargarPedidos();
    }
    
    return venta;
}

// Función para simular un pedido (solo para pruebas)
function simularPedido() {
    const nuevoPedido = {
        id: generarId(),
        nombre: 'Cliente de Prueba',
        fecha: new Date().toLocaleDateString('es-CL'),
        estado: 'pending',
        monto: Math.floor(Math.random() * 100000) + 5000,
        productos: [
            { nombre: 'Producto 1', cantidad: 2, precio: 1500 },
            { nombre: 'Producto 2', cantidad: 1, precio: 2000 }
        ]
    };
    
    agregarVenta(nuevoPedido);
    mostrarNotificacion('Pedido de prueba creado correctamente', 'success');
}

// Función para actualizar una venta existente
function actualizarVenta(id, datosActualizados) {
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index !== -1) {
        // Actualizar los datos
        usuarios[index] = { ...usuarios[index], ...datosActualizados };
        
        // Guardar en localStorage
        guardarVentasEnLocalStorage();
        
        // Actualizar la interfaz
        cargarUsuarios();
        
        return usuarios[index];
    }
    
    return null;
}

// Función para mostrar mensaje de notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `admin-notification ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Función para exportar datos a Excel
function exportarAExcel(tipoInforme) {
    let datosExportar = [];
    
    // Si es el informe de pedidos, obtener datos reales del localStorage
    if (tipoInforme === 'pedidos') {
        const ventasGuardadas = localStorage.getItem('ventas');
        if (ventasGuardadas) {
            datosExportar = JSON.parse(ventasGuardadas);
        }
    } else {
        // Para otros informes, usar los datos de ejemplo
        datosExportar = datosInformes[tipoInforme] || [];
    }
    
    // Verificar si existen datos para exportar
    if (datosExportar.length === 0) {
        mostrarNotificacion('No hay datos disponibles para exportar', 'error');
        return;
    }
    
    try {
        // Crear una nueva hoja de cálculo
        const wb = XLSX.utils.book_new();
        
        // Convertir los datos a una hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, `Informe_${tipoInforme}`);
        
        // Generar el archivo Excel y descargarlo
        const nombreArchivo = `Informe_${tipoInforme}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);
        
        // Mostrar notificación de éxito
        mostrarNotificacion(`Informe exportado correctamente: ${nombreArchivo}`, 'success');
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        mostrarNotificacion('Error al exportar el informe a Excel', 'error');
    }
}

// Función para cargar usuarios en la tabla
function cargarUsuarios(usuariosFiltrados = null) {
    const tabla = document.querySelector('.admin-table tbody');
    if (!tabla) return;
    
    const listaUsuarios = usuariosFiltrados || usuarios;
    
    tabla.innerHTML = '';
    
    listaUsuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        
        // Formatear el monto según el formato solicitado
        const montoFormateado = `US$${usuario.monto.toFixed(2).replace('.', ',')}`;
        
        fila.innerHTML = `
            <td>${usuario.fecha}</td>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td><span class="admin-table-status status-${usuario.estado}">${capitalizar(usuario.estado)}</span></td>
            <td>${montoFormateado}</td>
        `;
        
        tabla.appendChild(fila);
    });
    
    // Actualizar contador de ventas en tiempo real si existe
    actualizarContadorVentas();
}

// Función para cargar pedidos en la tabla
function cargarPedidos() {
    const tablaPedidos = document.getElementById('tabla-pedidos');
    if (!tablaPedidos) return;
    
    // Obtener pedidos desde localStorage
    const ventasGuardadas = localStorage.getItem('ventas');
    const pedidos = ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
    
    tablaPedidos.innerHTML = '';
    
    if (pedidos.length === 0) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `<td colspan="6" class="text-center">No hay pedidos disponibles</td>`;
        tablaPedidos.appendChild(filaVacia);
        return;
    }
    
    pedidos.forEach(pedido => {
        const fila = document.createElement('tr');
        
        // Determinar la clase de badge según el estado
        let badgeClass = 'bg-secondary';
        let estadoTexto = 'Desconocido';
        
        switch(pedido.estado) {
            case 'pending':
                badgeClass = 'bg-warning text-dark';
                estadoTexto = 'Pendiente';
                break;
            case 'completed':
                badgeClass = 'bg-success';
                estadoTexto = 'Completado';
                break;
            case 'processing':
                badgeClass = 'bg-info';
                estadoTexto = 'En proceso';
                break;
            case 'cancelled':
                badgeClass = 'bg-danger';
                estadoTexto = 'Cancelado';
                break;
        }
        
        // Formatear el monto
        const montoFormateado = `$${pedido.monto.toLocaleString('es-CL')}`;
        
        fila.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.fecha}</td>
            <td>
                <div class="dropdown">
                    <span class="badge ${badgeClass} dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                        ${estadoTexto}
                    </span>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="cambiarEstadoPedido('${pedido.id}', 'pending')">Pendiente</a></li>
                        <li><a class="dropdown-item" href="#" onclick="cambiarEstadoPedido('${pedido.id}', 'processing')">En proceso</a></li>
                        <li><a class="dropdown-item" href="#" onclick="cambiarEstadoPedido('${pedido.id}', 'completed')">Completado</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="cambiarEstadoPedido('${pedido.id}', 'cancelled')">Cancelado</a></li>
                    </ul>
                </div>
            </td>
            <td>${montoFormateado}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-print"></i></button>
            </td>
        `;
        
        tablaPedidos.appendChild(fila);
    });
}

// Función para cambiar el estado de un pedido
function cambiarEstadoPedido(id, nuevoEstado) {
    // Obtener pedidos desde localStorage
    const ventasGuardadas = localStorage.getItem('ventas');
    if (!ventasGuardadas) return;
    
    let pedidos = JSON.parse(ventasGuardadas);
    
    // Encontrar el pedido por ID y actualizar su estado
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].estado = nuevoEstado;
        
        // Guardar los cambios en localStorage
        localStorage.setItem('ventas', JSON.stringify(pedidos));
        
        // Recargar la tabla de pedidos
        cargarPedidos();
        
        // Mostrar notificación
        const estadosTexto = {
            'pending': 'pendiente',
            'processing': 'en proceso',
            'completed': 'completado',
            'cancelled': 'cancelado'
        };
        
        mostrarNotificacion(`Pedido #${id} marcado como ${estadosTexto[nuevoEstado]}`, 'success');
        
        // Actualizar estadísticas
        actualizarEstadisticas();
    }
}

// Función para actualizar el contador de ventas en tiempo real
function actualizarContadorVentas() {
    const contadorVentas = document.getElementById('contador-ventas');
    if (contadorVentas) {
        const ventasPendientes = usuarios.filter(u => u.estado === 'pending').length;
        contadorVentas.textContent = ventasPendientes;
        
        // Actualizar también en el título de la página si está disponible
        const tituloVentas = document.querySelector('.admin-table-title');
        if (tituloVentas) {
            tituloVentas.innerHTML = `All Sales Orders <span class="contador-badge">${ventasPendientes}</span>`;
        }
    }
}

// Función para capitalizar texto
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Función para filtrar usuarios por estado
function filtrarUsuariosPorEstado(estado) {
    if (!estado) return usuarios;
    return usuarios.filter(usuario => usuario.estado === estado.toLowerCase());
}

// Función para validar formulario de nuevo usuario
function validarFormularioUsuario(formData) {
    const errores = [];
    
    // Validar nombre
    if (!formData.nombre) {
        errores.push('El nombre es obligatorio');
    }
    
    // Validar correo
    if (!formData.correo) {
        errores.push('El correo es obligatorio');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        errores.push('El correo no es válido');
    }
    
    // Validar contraseña
    if (!formData.password) {
        errores.push('La contraseña es obligatoria');
    } else if (formData.password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
    } else if (!/[A-Z]/.test(formData.password)) {
        errores.push('La contraseña debe tener al menos una mayúscula');
    } else if (!/\d/.test(formData.password)) {
        errores.push('La contraseña debe tener al menos un número');
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData['confirm-password']) {
        errores.push('Las contraseñas no coinciden');
    }
    
    return errores;
}

// Función para crear un nuevo usuario
function crearNuevoUsuario(formData) {
    const nuevoUsuario = {
        id: generarId(),
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono || '',
        direccion: formData.direccion || '',
        ciudad: formData.ciudad || '',
        estado: 'pending',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0]
    };
    
    usuarios.unshift(nuevoUsuario);
    
    // En una aplicación real, aquí se enviaría al servidor
    localStorage.setItem('admin_usuarios', JSON.stringify(usuarios));
    
    return nuevoUsuario;
}

// Función para crear automáticamente los empleados César y Franco como desarrolladores
function crearEmpleadosAutomaticamente() {
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    
    // Verificar si César ya existe
    const cesarExiste = empleados.some(e => e.nombre === 'César' && e.cargo === 'Desarrollador');
    
    // Verificar si Franco ya existe
    const francoExiste = empleados.some(e => e.nombre === 'Franco' && e.cargo === 'Desarrollador');
    
    let empleadosActualizados = false;
    
    // Crear César si no existe
    if (!cesarExiste) {
        const cesar = {
            id: generarId(),
            nombre: 'César',
            apellido: 'Pérez',
            cargo: 'Desarrollador',
            departamento: 'Tecnología',
            email: 'cesar@duoc.cl',
            telefono: '+56912345678',
            fechaContratacion: new Date().toISOString().split('T')[0],
            estado: 'Activo'
        };
        empleados.push(cesar);
        empleadosActualizados = true;
        console.log('Empleado César creado automáticamente');
    }
    
    // Crear Franco si no existe
    if (!francoExiste) {
        const franco = {
            id: generarId(),
            nombre: 'Franco',
            apellido: 'Gómez',
            cargo: 'Desarrollador',
            departamento: 'Tecnología',
            email: 'fr.ruzv@duocuc.cl',
            telefono: '+56998765432',
            fechaContratacion: new Date().toISOString().split('T')[0],
            estado: 'Activo'
        };
        empleados.push(franco);
        empleadosActualizados = true;
        console.log('Empleado Franco creado automáticamente');
    }
    
    // Guardar en localStorage si se realizaron cambios
    if (empleadosActualizados) {
        localStorage.setItem('admin_empleados', JSON.stringify(empleados));
        console.log('Empleados actualizados en localStorage');
    }
}

// Función para cargar empleados en la tabla
function cargarEmpleados() {
    const tablaEmpleados = document.querySelector('.table');
    if (!tablaEmpleados) return;
    
    const tbody = tablaEmpleados.querySelector('tbody') || document.createElement('tbody');
    tbody.innerHTML = '';
    
    // Obtener empleados de localStorage
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    
    if (empleados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" class="text-center">No hay empleados registrados</td>';
        tbody.appendChild(tr);
    } else {
        empleados.forEach(empleado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${empleado.id}</td>
                <td>${empleado.nombre} ${empleado.apellido}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.departamento}</td>
                <td>${empleado.email}</td>
                <td>
                    <button class="btn btn-sm btn-info me-1 btn-ver" data-id="${empleado.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-primary me-1 btn-editar" data-id="${empleado.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${empleado.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Agregar event listeners a los botones
        agregarEventListenersEmpleados();
    }
    
    if (!tablaEmpleados.contains(tbody)) {
        tablaEmpleados.appendChild(tbody);
    }
}

// Función para agregar event listeners a los botones de empleados
function agregarEventListenersEmpleados() {
    // Botones Ver
    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            verEmpleado(id);
        });
    });
    
    // Botones Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editarEmpleado(id);
        });
    });
    
    // Botones Eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            eliminarEmpleado(id);
        });
    });
}

// Función para ver detalles de un empleado
function verEmpleado(id) {
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    const empleado = empleados.find(e => e.id === id);
    
    if (!empleado) {
        alert('Empleado no encontrado');
        return;
    }
    
    // Crear modal para mostrar detalles
    const modalHTML = `
    <div class="modal fade" id="modalVerEmpleado" tabindex="-1" aria-labelledby="modalVerEmpleadoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalVerEmpleadoLabel">Detalles del Empleado</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${empleado.nombre} ${empleado.apellido}</h5>
                            <p class="card-text"><strong>ID:</strong> ${empleado.id}</p>
                            <p class="card-text"><strong>Cargo:</strong> ${empleado.cargo}</p>
                            <p class="card-text"><strong>Departamento:</strong> ${empleado.departamento}</p>
                            <p class="card-text"><strong>Email:</strong> ${empleado.email}</p>
                            <p class="card-text"><strong>Teléfono:</strong> ${empleado.telefono}</p>
                            <p class="card-text"><strong>Fecha de Contratación:</strong> ${empleado.fechaContratacion}</p>
                            <p class="card-text"><strong>Estado:</strong> ${empleado.estado}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modalVerEmpleado');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalVerEmpleado'));
    modal.show();
}

// Función para editar un empleado
function editarEmpleado(id) {
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    const empleado = empleados.find(e => e.id === id);
    
    if (!empleado) {
        alert('Empleado no encontrado');
        return;
    }
    
    // Crear modal para editar
    const modalHTML = `
    <div class="modal fade" id="modalEditarEmpleado" tabindex="-1" aria-labelledby="modalEditarEmpleadoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEditarEmpleadoLabel">Editar Empleado</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formEditarEmpleado">
                        <input type="hidden" id="empleadoId" value="${empleado.id}">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" value="${empleado.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label for="apellido" class="form-label">Apellido</label>
                            <input type="text" class="form-control" id="apellido" value="${empleado.apellido}" required>
                        </div>
                        <div class="mb-3">
                            <label for="cargo" class="form-label">Cargo</label>
                            <input type="text" class="form-control" id="cargo" value="${empleado.cargo}" required>
                        </div>
                        <div class="mb-3">
                            <label for="departamento" class="form-label">Departamento</label>
                            <input type="text" class="form-control" id="departamento" value="${empleado.departamento}" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" value="${empleado.email}" required>
                        </div>
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="telefono" value="${empleado.telefono}" required>
                        </div>
                        <div class="mb-3">
                            <label for="fechaContratacion" class="form-label">Fecha de Contratación</label>
                            <input type="date" class="form-control" id="fechaContratacion" value="${empleado.fechaContratacion}" required>
                        </div>
                        <div class="mb-3">
                            <label for="estado" class="form-label">Estado</label>
                            <select class="form-control" id="estado" required>
                                <option value="Activo" ${empleado.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                                <option value="Inactivo" ${empleado.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                <option value="Vacaciones" ${empleado.estado === 'Vacaciones' ? 'selected' : ''}>Vacaciones</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarEmpleado">Guardar Cambios</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modalEditarEmpleado');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarEmpleado'));
    modal.show();
    
    // Agregar event listener al botón de guardar
    document.getElementById('btnGuardarEmpleado').addEventListener('click', function() {
        guardarCambiosEmpleado();
    });
}

// Función para guardar cambios de un empleado
function guardarCambiosEmpleado() {
    const id = document.getElementById('empleadoId').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const cargo = document.getElementById('cargo').value;
    const departamento = document.getElementById('departamento').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const fechaContratacion = document.getElementById('fechaContratacion').value;
    const estado = document.getElementById('estado').value;
    
    // Validar campos
    if (!nombre || !apellido || !cargo || !departamento || !email || !telefono || !fechaContratacion || !estado) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    // Obtener empleados de localStorage
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    
    // Encontrar índice del empleado
    const index = empleados.findIndex(e => e.id === id);
    
    if (index === -1) {
        alert('Empleado no encontrado');
        return;
    }
    
    // Actualizar empleado
    empleados[index] = {
        ...empleados[index],
        nombre,
        apellido,
        cargo,
        departamento,
        email,
        telefono,
        fechaContratacion,
        estado
    };
    
    // Guardar en localStorage
    localStorage.setItem('admin_empleados', JSON.stringify(empleados));
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarEmpleado'));
    modal.hide();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('Empleado actualizado correctamente');
    
    // Recargar tabla
    cargarEmpleados();
}

// Función para eliminar un empleado
function eliminarEmpleado(id) {
    if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
        return;
    }
    
    // Obtener empleados de localStorage
    const empleados = JSON.parse(localStorage.getItem('admin_empleados') || '[]');
    
    // Filtrar empleados
    const nuevosEmpleados = empleados.filter(e => e.id !== id);
    
    // Guardar en localStorage
    localStorage.setItem('admin_empleados', JSON.stringify(nuevosEmpleados));
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('Empleado eliminado correctamente');
    
    // Recargar tabla
    cargarEmpleados();
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
    notificacion.setAttribute('role', 'alert');
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Función para actualizar el panel de estadísticas
function actualizarEstadisticas() {
    // Obtener pedidos desde localStorage
    const ventasGuardadas = localStorage.getItem('ventas');
    const pedidos = ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
    
    // Actualizar ventas totales
    const ventasTotales = document.getElementById('ventas-totales');
    if (ventasTotales) {
        // Calcular el total de ventas desde localStorage
        const totalVentas = pedidos.length > 0
            ? pedidos.reduce((total, pedido) => total + pedido.monto, 0)
            : usuarios.reduce((total, usuario) => total + usuario.monto, 0);
        ventasTotales.textContent = `$${totalVentas.toLocaleString()}`;
    }
    
    // Actualizar pedidos nuevos
    const pedidosNuevos = document.getElementById('pedidos-nuevos');
    if (pedidosNuevos) {
        // Contar pedidos pendientes desde localStorage
        const totalPedidos = pedidos.length > 0
            ? pedidos.filter(p => p.estado === 'pending').length
            : usuarios.filter(u => u.estado === 'pending').length;
        pedidosNuevos.textContent = totalPedidos;
    }
    
    // Actualizar clientes activos
    const clientesActivos = document.getElementById('clientes-activos');
    if (clientesActivos) {
        // Obtener clientes únicos por nombre desde localStorage
        const clientesUnicos = pedidos.length > 0
            ? new Set(pedidos.map(p => p.nombre))
            : new Set(usuarios.map(u => u.nombre));
        clientesActivos.textContent = clientesUnicos.size;
    }
    
    // Actualizar productos en stock (este dato podría venir de otra fuente)
    const productosStock = document.getElementById('productos-stock');
    if (productosStock) {
        // Inicializar con valor cero
        productosStock.textContent = '0';
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear empleados automáticamente si no existen
    crearEmpleadosAutomaticamente();
    
    // Cargar usuarios guardados en localStorage si existen
    const usuariosGuardados = localStorage.getItem('admin_usuarios');
    if (usuariosGuardados) {
        usuarios = JSON.parse(usuariosGuardados);
    }
    
    // Cargar ventas desde localStorage si existen
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
        const ventas = JSON.parse(ventasGuardadas);
        // Combinar ventas con usuarios si no existen ya
        ventas.forEach(venta => {
            if (!usuarios.some(u => u.id === venta.id)) {
                usuarios.push(venta);
            }
        });
    }
    
    // Actualizar estadísticas si estamos en la página principal del admin
    if (document.querySelector('.admin-dashboard')) {
        actualizarEstadisticas();
    }
    
    // Inicializar tabla de usuarios si estamos en la página de usuarios
    if (document.querySelector('.admin-table')) {
        cargarUsuarios();
        
        // Configurar filtro de estado
        const filtroEstado = document.querySelector('select.admin-form-control');
        if (filtroEstado) {
            filtroEstado.addEventListener('change', function() {
                const estado = this.value === 'Filtrar por estado' ? '' : this.value;
                const usuariosFiltrados = filtrarUsuariosPorEstado(estado);
                cargarUsuarios(usuariosFiltrados);
            });
        }
    }
    
    // Cargar empleados si estamos en la página de empleados
    if (window.location.href.includes('admin-employees.html')) {
        cargarEmpleados();
    }
    
    // Configurar formulario de nuevo usuario
    const formNuevoUsuario = document.getElementById('new-user-form');
    if (formNuevoUsuario) {
        formNuevoUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {};
            new FormData(this).forEach((value, key) => {
                formData[key] = value;
            });
            
            const errores = validarFormularioUsuario(formData);
            
            if (errores.length > 0) {
                // Mostrar errores
                alert(errores.join('\n'));
                return;
            }
            
            // Crear usuario
            const nuevoUsuario = crearNuevoUsuario(formData);
            
            // Mostrar mensaje de éxito
            mostrarNotificacion('Usuario creado correctamente');
            
            // Redireccionar a la lista de usuarios después de un breve retraso
            setTimeout(() => {
                window.location.href = 'admin-users.html';
            }, 1500);
        });
    }
    
    // Inicializar botones de exportación a Excel
    const botonesExportar = document.querySelectorAll('.export-excel');
    if (botonesExportar.length > 0) {
        botonesExportar.forEach(boton => {
            const tipoInforme = boton.getAttribute('data-report');
            boton.addEventListener('click', () => exportarAExcel(tipoInforme));
        });
    }
    
    // Cargar pedidos en la tabla si estamos en la página de pedidos
    const tablaPedidos = document.getElementById('tabla-pedidos');
    if (tablaPedidos) {
        cargarPedidos();
    }
});