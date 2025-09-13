document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando validaciones...');
    
    // Detectar qué formulario está presente en la página
    const registroForm = document.getElementById('registro-form');
    const loginForm = document.getElementById('login-form');
    const contactForm = document.getElementById('contact-form');
    
    console.log('Formularios detectados:', { 
        registro: registroForm !== null, 
        login: loginForm !== null, 
        contacto: contactForm !== null 
    });
    
    // Configurar validaciones según el formulario presente
    if (registroForm) {
        configurarValidacionRegistro();
        console.log('Validación de registro configurada');
    } 
    
    if (loginForm) {
        configurarValidacionLogin();
        console.log('Validación de login configurada');
    } 
    
    if (contactForm) {
        configurarValidacionContacto();
        console.log('Validación de contacto configurada');
    }
    
    // Validación de formulario de registro
    function configurarValidacionRegistro() {
        const form = document.getElementById('registro-form');
        const nombreInput = document.getElementById('nombre');
        const runInput = document.getElementById('run');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const regionSelect = document.getElementById('region');
        const comunaSelect = document.getElementById('comuna');
        const direccionInput = document.getElementById('direccion');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        // Evento para formatear el RUN automáticamente
        runInput.addEventListener('input', function() {
            // Guardar la posición del cursor
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const valorOriginal = this.value;
            
            // Formatear el RUN
            this.value = formatearRUN(valorOriginal);
            
            // Ajustar la posición del cursor si el valor ha cambiado
            if (valorOriginal !== this.value) {
                // Calcular el desplazamiento por los puntos y guión añadidos
                const diff = this.value.length - valorOriginal.length;
                this.setSelectionRange(start + diff, end + diff);
            }
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Validar nombre
            if (!nombreInput.value.trim()) {
                mostrarError(nombreInput, 'El nombre es obligatorio');
                isValid = false;
            } else if (nombreInput.value.length > 100) {
                mostrarError(nombreInput, 'El nombre no puede exceder los 100 caracteres');
                isValid = false;
            } else {
                limpiarError(nombreInput);
            }
            
            // Validar RUN
            if (!runInput.value.trim()) {
                mostrarError(runInput, 'El RUN es obligatorio');
                isValid = false;
            } else if (!validarRUN(runInput.value)) {
                mostrarError(runInput, 'El RUN no es válido');
                isValid = false;
            } else {
                limpiarError(runInput);
            }
            
            // Validar email
            if (!emailInput.value.trim()) {
                mostrarError(emailInput, 'El email es obligatorio');
                isValid = false;
            } else if (!validarEmail(emailInput.value)) {
                mostrarError(emailInput, 'El email no es válido o no tiene un dominio permitido');
                isValid = false;
            } else {
                limpiarError(emailInput);
            }
            
            // Validar teléfono (opcional)
            if (telefonoInput.value.trim() && !validarTelefono(telefonoInput.value)) {
                mostrarError(telefonoInput, 'El formato del teléfono no es válido');
                isValid = false;
            } else {
                limpiarError(telefonoInput);
            }
            
            // Validar región
            if (!regionSelect.value) {
                mostrarError(regionSelect, 'Debe seleccionar una región');
                isValid = false;
            } else {
                limpiarError(regionSelect);
            }
            
            // Validar comuna
            if (!comunaSelect.value) {
                mostrarError(comunaSelect, 'Debe seleccionar una comuna');
                isValid = false;
            } else {
                limpiarError(comunaSelect);
            }
            
            // Validar dirección
            if (!direccionInput.value.trim()) {
                mostrarError(direccionInput, 'La dirección es obligatoria');
                isValid = false;
            } else if (direccionInput.value.length > 300) {
                mostrarError(direccionInput, 'La dirección no puede exceder los 300 caracteres');
                isValid = false;
            } else {
                limpiarError(direccionInput);
            }
            
            // Validar contraseña
            if (!passwordInput.value) {
                mostrarError(passwordInput, 'La contraseña es obligatoria');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                mostrarError(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
                isValid = false;
            } else {
                limpiarError(passwordInput);
            }
            
            // Validar confirmación de contraseña
            if (!confirmPasswordInput.value) {
                mostrarError(confirmPasswordInput, 'Debe confirmar la contraseña');
                isValid = false;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                mostrarError(confirmPasswordInput, 'Las contraseñas no coinciden');
                isValid = false;
            } else {
                limpiarError(confirmPasswordInput);
            }
            
            if (isValid) {
                // Crear objeto con los datos del usuario
                const usuario = {
                    nombre: nombreInput.value.trim(),
                    run: runInput.value.trim(),
                    email: emailInput.value.trim(),
                    telefono: telefonoInput.value.trim() || 'No proporcionado',
                    region: regionSelect.value,
                    comuna: comunaSelect.value,
                    direccion: direccionInput.value.trim(),
                    password: passwordInput.value, // En una aplicación real, esto debería estar encriptado
                    fechaRegistro: new Date().toISOString()
                };
                
                // Guardar en localStorage
                guardarUsuarioEnLocalStorage(usuario);
                
                // Ya no generamos el archivo de texto automáticamente
                
                alert('Registro exitoso! Los datos han sido guardados.');
                form.reset();
            }
        });
        
        // Eliminamos la creación del botón de descarga
    }
    
    // Validación de formulario de login con autenticación de dos factores
    function configurarValidacionLogin() {
        const loginForm = document.getElementById('login-form');
        const verificationForm = document.getElementById('verification-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const verificationCodeInput = document.getElementById('verification-code');
        const verificationEmailSpan = document.getElementById('verification-email');
        const resendCodeBtn = document.getElementById('resend-code');
        const backToLoginBtn = document.getElementById('back-to-login');
        
        // Paso 1: Validación de credenciales
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Validar email
            if (!emailInput.value.trim()) {
                mostrarError(emailInput, 'El email es obligatorio');
                isValid = false;
            } else if (!validarEmail(emailInput.value)) {
                mostrarError(emailInput, 'El email no es válido o no tiene un dominio permitido');
                isValid = false;
            } else {
                limpiarError(emailInput);
            }
            
            // Validar contraseña
            if (!passwordInput.value) {
                mostrarError(passwordInput, 'La contraseña es obligatoria');
                isValid = false;
            } else {
                limpiarError(passwordInput);
            }
            
            if (isValid) {
                // Verificar si el usuario existe en localStorage
                const usuarios = obtenerUsuariosDeLocalStorage();
                const usuario = usuarios.find(u => u.email === emailInput.value.trim() && u.password === passwordInput.value);
                
                if (usuario) {
                    try {
                        // Mostrar indicador de carga
                        const submitBtn = loginForm.querySelector('button[type="submit"]');
                        const originalText = submitBtn.textContent;
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Verificando...';
                        
                        console.log('Iniciando autenticación de dos factores para:', usuario.email);
                        
                        // Iniciar proceso de autenticación de dos factores
                        await window.twoFactorAuth.iniciarAutenticacionDosFactores(usuario);
                        
                        console.log('Autenticación de dos factores iniciada correctamente');
                        
                        // Mostrar formulario de verificación
                        loginForm.classList.remove('active');
                        loginForm.classList.add('hidden');
                        verificationForm.classList.remove('hidden');
                        verificationForm.classList.add('active');
                        
                        // Mostrar email al que se envió el código
                        verificationEmailSpan.textContent = emailInput.value.trim();
                        
                        // Restaurar botón
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    } catch (error) {
                        console.error('Error al iniciar autenticación de dos factores:', error);
                        alert('Ha ocurrido un error al enviar el código de verificación. Por favor, intente nuevamente.');
                    }
                } else {
                    // Verificar si el email existe pero la contraseña es incorrecta
                    const emailExiste = usuarios.some(u => u.email === emailInput.value.trim());
                    if (emailExiste) {
                        alert('Contraseña incorrecta. Por favor, intente nuevamente.');
                    } else {
                        alert('Usuario no registrado. Por favor, regístrese antes de iniciar sesión.');
                    }
                }
            }
        });
        
        // Paso 2: Verificación del código
        if (verificationForm) {
            verificationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Validar código de verificación
                const codigo = verificationCodeInput.value.trim();
                if (!codigo) {
                    mostrarError(verificationCodeInput, 'El código de verificación es obligatorio');
                    isValid = false;
                } else if (!/^\d{6}$/.test(codigo)) {
                    mostrarError(verificationCodeInput, 'El código debe contener 6 dígitos');
                    isValid = false;
                } else {
                    limpiarError(verificationCodeInput);
                }
                
                if (isValid) {
                    // Verificar el código
                    if (window.twoFactorAuth.verificarCodigo(codigo)) {
                        // Completar autenticación
                        const usuario = window.twoFactorAuth.completarAutenticacion();
                        if (usuario) {
                            alert(`Bienvenido ${usuario.nombre}! Inicio de sesión exitoso.`);
                            verificationForm.reset();
                            // Redirigir al usuario a la página de mi cuenta
                            window.location.href = 'mi-cuenta.html';
                        } else {
                            alert('Ha ocurrido un error. Por favor, intente iniciar sesión nuevamente.');
                            volverAInicioSesion();
                        }
                    } else {
                        mostrarError(verificationCodeInput, 'Código incorrecto o expirado');
                    }
                }
            });
            
            // Reenviar código
            if (resendCodeBtn) {
                resendCodeBtn.addEventListener('click', async function() {
                    const tfaData = window.twoFactorAuth.obtenerDatosVerificacion();
                    if (!tfaData) {
                        alert('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
                        volverAInicioSesion();
                        return;
                    }
                    
                    try {
                        // Deshabilitar botón mientras se envía
                        resendCodeBtn.disabled = true;
                        resendCodeBtn.textContent = 'Enviando...';
                        
                        // Reenviar código
                        await window.twoFactorAuth.iniciarAutenticacionDosFactores(tfaData.usuario);
                        
                        alert('Se ha enviado un nuevo código de verificación.');
                        
                        // Restaurar botón
                        resendCodeBtn.disabled = false;
                        resendCodeBtn.textContent = 'Reenviar código';
                    } catch (error) {
                        console.error('Error al reenviar código:', error);
                        alert('Ha ocurrido un error al reenviar el código. Por favor, intente nuevamente.');
                        resendCodeBtn.disabled = false;
                        resendCodeBtn.textContent = 'Reenviar código';
                    }
                });
            }
            
            // Volver al inicio de sesión
            if (backToLoginBtn) {
                backToLoginBtn.addEventListener('click', volverAInicioSesion);
            }
            
            function volverAInicioSesion() {
                // Limpiar datos de verificación
                window.twoFactorAuth.limpiarDatosVerificacion();
                
                // Mostrar formulario de inicio de sesión
                verificationForm.classList.remove('active');
                verificationForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                loginForm.classList.add('active');
                
                // Limpiar campos
                verificationForm.reset();
            }
        }
    }
    
    // Validación de formulario de contacto
    function configurarValidacionContacto() {
        const form = document.getElementById('contact-form');
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const asuntoInput = document.getElementById('asunto');
        const mensajeInput = document.getElementById('mensaje');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Validar nombre
            if (!nombreInput.value.trim()) {
                mostrarError(nombreInput, 'El nombre es obligatorio');
                isValid = false;
            } else {
                limpiarError(nombreInput);
            }
            
            // Validar email
            if (!emailInput.value.trim()) {
                mostrarError(emailInput, 'El email es obligatorio');
                isValid = false;
            } else if (!validarEmail(emailInput.value)) {
                mostrarError(emailInput, 'El email no es válido');
                isValid = false;
            } else {
                limpiarError(emailInput);
            }
            
            // Validar asunto
            if (!asuntoInput.value.trim()) {
                mostrarError(asuntoInput, 'El asunto es obligatorio');
                isValid = false;
            } else {
                limpiarError(asuntoInput);
            }
            
            // Validar mensaje
            if (!mensajeInput.value.trim()) {
                mostrarError(mensajeInput, 'El mensaje es obligatorio');
                isValid = false;
            } else {
                limpiarError(mensajeInput);
            }
            
            if (isValid) {
                alert('Mensaje enviado con éxito!');
                form.reset();
            }
        });
    }
    
    // Funciones auxiliares
    function mostrarError(input, mensaje) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        errorMessage.textContent = mensaje;
    }
    
    function limpiarError(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        errorMessage.textContent = '';
    }
    
    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        return regex.test(email);
    }
    
    function validarTelefono(telefono) {
        const regex = /^\+?56?[0-9]{9}$/;
        return regex.test(telefono);
    }
    
    function validarRUN(run) {
        try {
            // Importar la función desde run-validator.js si está disponible
            if (typeof window.validarRUN === 'function') {
                return window.validarRUN(run);
            } else {
                // Validación básica como respaldo
                const regex = /^\d{1,2}\.?\d{3}\.?\d{3}-[0-9kK]$/;
                return regex.test(run);
            }
        } catch (error) {
            console.error('Error al validar RUN:', error);
            return false;
        }
    }
    
    // Funciones para manejo de localStorage y generación de archivo TXT
    function guardarUsuarioEnLocalStorage(usuario) {
        // Obtener usuarios existentes
        const usuarios = obtenerUsuariosDeLocalStorage();
        
        // Verificar si el usuario ya existe (por RUN o email)
        const usuarioExistente = usuarios.findIndex(u => u.run === usuario.run || u.email === usuario.email);
        
        if (usuarioExistente >= 0) {
            // Actualizar usuario existente
            usuarios[usuarioExistente] = usuario;
        } else {
            // Agregar nuevo usuario
            usuarios.push(usuario);
        }
        
        // Guardar en localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    function obtenerUsuariosDeLocalStorage() {
        const usuariosJSON = localStorage.getItem('usuarios');
        return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }
    
    function generarArchivoTextoUsuarios() {
        const usuarios = obtenerUsuariosDeLocalStorage();
        
        if (usuarios.length === 0) {
            alert('No hay usuarios registrados para generar el archivo.');
            return;
        }
        
        let contenido = 'REGISTRO DE USUARIOS\n';
        contenido += '===================\n\n';
        
        usuarios.forEach((usuario, index) => {
            contenido += `USUARIO ${index + 1}\n`;
            contenido += `Nombre: ${usuario.nombre}\n`;
            contenido += `RUN: ${usuario.run}\n`;
            contenido += `Email: ${usuario.email}\n`;
            contenido += `Teléfono: ${usuario.telefono}\n`;
            contenido += `Región: ${usuario.region}\n`;
            contenido += `Comuna: ${usuario.comuna}\n`;
            contenido += `Dirección: ${usuario.direccion}\n`;
            contenido += `Fecha de registro: ${new Date(usuario.fechaRegistro).toLocaleString('es-CL')}\n`;
            contenido += '-------------------\n\n';
        });
        
        // Crear blob y enlace de descarga
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios_registrados.txt';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
});