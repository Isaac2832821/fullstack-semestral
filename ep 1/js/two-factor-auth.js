/**
 * two-factor-auth.js - Implementación de autenticación de dos factores
 * 
 * Este archivo contiene las funciones necesarias para implementar
 * la autenticación de dos factores (2FA) en el proceso de inicio de sesión.
 */

// Configuración de 2FA
const TFA_CONFIG = {
    codeLength: 6,           // Longitud del código de verificación
    codeExpiry: 5 * 60 * 1000, // Tiempo de expiración en ms (5 minutos)
    storageKey: 'tfa_data'   // Clave para almacenar datos de 2FA en localStorage
};

/**
 * Genera un código de verificación aleatorio
 * @returns {string} Código de verificación
 */
function generarCodigoVerificacion() {
    let codigo = '';
    for (let i = 0; i < TFA_CONFIG.codeLength; i++) {
        codigo += Math.floor(Math.random() * 10);
    }
    return codigo;
}

/**
 * Simula el envío de un código de verificación por email
 * En una implementación real, esto enviaría un email o SMS
 * @param {string} email - Email del usuario
 * @param {string} codigo - Código de verificación
 * @returns {Promise} Promesa que se resuelve cuando se "envía" el código
 */
function enviarCodigoVerificacion(email, codigo) {
    return new Promise((resolve) => {
        console.log(`[SIMULACIÓN] Enviando código ${codigo} al email ${email}`);
        // Simular un retraso de red
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

/**
 * Guarda los datos de verificación en localStorage
 * @param {string} email - Email del usuario
 * @param {string} codigo - Código de verificación
 * @param {Object} usuario - Datos del usuario
 */
function guardarDatosVerificacion(email, codigo, usuario) {
    const tfaData = {
        email,
        codigo,
        usuario,
        expira: Date.now() + TFA_CONFIG.codeExpiry
    };
    localStorage.setItem(TFA_CONFIG.storageKey, JSON.stringify(tfaData));
}

/**
 * Obtiene los datos de verificación de localStorage
 * @returns {Object|null} Datos de verificación o null si no existen o han expirado
 */
function obtenerDatosVerificacion() {
    const tfaDataStr = localStorage.getItem(TFA_CONFIG.storageKey);
    if (!tfaDataStr) return null;
    
    const tfaData = JSON.parse(tfaDataStr);
    
    // Verificar si el código ha expirado
    if (Date.now() > tfaData.expira) {
        localStorage.removeItem(TFA_CONFIG.storageKey);
        return null;
    }
    
    return tfaData;
}

/**
 * Limpia los datos de verificación de localStorage
 */
function limpiarDatosVerificacion() {
    localStorage.removeItem(TFA_CONFIG.storageKey);
}

/**
 * Verifica si un código es válido
 * @param {string} codigo - Código ingresado por el usuario
 * @returns {boolean} True si el código es válido
 */
function verificarCodigo(codigo) {
    const tfaData = obtenerDatosVerificacion();
    if (!tfaData) return false;
    
    return tfaData.codigo === codigo;
}

/**
 * Completa el proceso de autenticación después de verificar el código
 * @returns {Object|null} Datos del usuario o null si no hay datos de verificación
 */
function completarAutenticacion() {
    const tfaData = obtenerDatosVerificacion();
    if (!tfaData) return null;
    
    // Guardar la sesión del usuario
    window.guardarSesion(tfaData.usuario);
    
    // Limpiar los datos de verificación
    limpiarDatosVerificacion();
    
    return tfaData.usuario;
}

/**
 * Inicia el proceso de autenticación de dos factores
 * @param {Object} usuario - Datos del usuario
 * @returns {Promise} Promesa que se resuelve cuando se inicia el proceso
 */
function iniciarAutenticacionDosFactores(usuario) {
    console.log('Iniciando proceso 2FA para usuario:', usuario.email);
    
    return new Promise(async (resolve, reject) => {
        try {
            // Generar código de verificación
            const codigo = generarCodigoVerificacion();
            console.log('Código generado:', codigo);
            
            // Guardar datos de verificación
            guardarDatosVerificacion(usuario.email, codigo, usuario);
            console.log('Datos de verificación guardados');
            
            // Enviar código de verificación
            await enviarCodigoVerificacion(usuario.email, codigo);
            console.log('Código enviado al email (simulado)');
            
            resolve(true);
        } catch (error) {
            console.error('Error en iniciarAutenticacionDosFactores:', error);
            reject(error);
        }
    });
}

// Exportar funciones
window.twoFactorAuth = {
    iniciarAutenticacionDosFactores,
    verificarCodigo,
    completarAutenticacion,
    obtenerDatosVerificacion,
    limpiarDatosVerificacion
};

// Verificar que el objeto se ha creado correctamente
console.log('Objeto twoFactorAuth inicializado:', window.twoFactorAuth);