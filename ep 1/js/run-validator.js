// Validador de RUN chileno
function validarRUN(run) {
    // Eliminar puntos y guiones
    run = run.replace(/\./g, '').replace('-', '');
    
    // Obtener dígito verificador
    const dv = run.slice(-1).toUpperCase();
    // Obtener cuerpo del RUN
    const cuerpo = run.slice(0, -1);
    
    // Validar que el cuerpo tenga exactamente 8 dígitos (para un total de 9 con el verificador)
    if (!/^\d{8}$/.test(cuerpo)) {
        return false;
    }
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    
    // Para cada dígito del cuerpo
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    // Calcular dígito verificador
    const dvEsperado = 11 - (suma % 11);
    let dvCalculado;
    
    if (dvEsperado === 11) {
        dvCalculado = '0';
    } else if (dvEsperado === 10) {
        dvCalculado = 'K';
    } else {
        dvCalculado = dvEsperado.toString();
    }
    
    // Comparar dígito verificador calculado con el proporcionado
    return dvCalculado === dv;
}

// Función para formatear RUN con puntos y guión
function formatearRUN(run) {
    // Eliminar puntos y guiones existentes
    run = run.replace(/\./g, '').replace(/-/g, '');
    
    // Si no hay nada que formatear, devolver el valor original
    if (run.length === 0) return '';
    
    // Separar el dígito verificador si existe
    let cuerpo = run;
    let dv = '';
    
    // Si el último carácter es un dígito o K/k, separarlo como dígito verificador
    if (/[\dKk]/.test(run.slice(-1))) {
        dv = run.slice(-1).toUpperCase();
        cuerpo = run.slice(0, -1);
    }
    
    // Eliminar caracteres no numéricos del cuerpo
    cuerpo = cuerpo.replace(/\D/g, '');
    
    // Limitar el cuerpo a exactamente 8 dígitos
    cuerpo = cuerpo.slice(0, 8);
    
    // Formatear el cuerpo con puntos
    let cuerpoFormateado = '';
    if (cuerpo.length > 0) {
        // Convertir a número para eliminar ceros a la izquierda
        const num = parseInt(cuerpo, 10);
        cuerpoFormateado = num.toLocaleString('es-CL');
    }
    
    // Devolver el RUN formateado
    return dv ? `${cuerpoFormateado}-${dv}` : cuerpoFormateado;
}

// Exportar funciones al objeto window para uso en otros archivos
window.validarRUN = validarRUN;
window.formatearRUN = formatearRUN;

// Exportar función para uso en entornos Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarRUN, formatearRUN };
}