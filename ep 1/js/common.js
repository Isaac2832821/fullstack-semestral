/**
 * common.js - Funcionalidades comunes para todas las páginas
 * 
 * Este archivo contiene funciones y comportamientos que se utilizan
 * en múltiples páginas del sitio, como el botón de volver arriba,
 * el banner de cookies, y otras utilidades.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades comunes
    initBackToTop();
    initCookieBanner();
    enhanceFormValidation();
});

/**
 * Inicializa el botón de volver arriba
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // Mostrar/ocultar el botón según el scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Acción de scroll suave al hacer clic
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Inicializa el banner de cookies
 */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieSettings = document.getElementById('cookieSettings');
    
    if (!cookieBanner || !cookieAccept || !cookieSettings) return;

    // Mostrar el banner si no se han aceptado las cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    // Manejar la aceptación de cookies
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('visible');
    });

    // Manejar la configuración de cookies
    cookieSettings.addEventListener('click', () => {
        // Aquí normalmente se abriría un modal con la configuración
        alert('Configuración de cookies (Esta función se implementará próximamente)');
    });
}

/**
 * Mejora la validación de formularios con feedback visual
 */
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Añadir clase de validación al perder el foco
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Validar en tiempo real para inputs con errores
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateInput(input);
                }
            });
        });
        
        // Validar todo el formulario al enviar
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Valida un campo de formulario individual
 * @param {HTMLElement} input - El campo a validar
 * @returns {boolean} - Si el campo es válido
 */
function validateInput(input) {
    let isValid = true;
    const errorElement = input.nextElementSibling?.classList.contains('error-message') ? 
                        input.nextElementSibling : null;
    
    // Validar según el tipo de input
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        showError(input, errorElement, 'Este campo es obligatorio');
    } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
        isValid = false;
        showError(input, errorElement, 'Por favor, introduce un email válido');
    } else if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
        isValid = false;
        showError(input, errorElement, 'Por favor, introduce un teléfono válido');
    } else if (input.id === 'password-confirm' && input.value !== document.getElementById('password')?.value) {
        isValid = false;
        showError(input, errorElement, 'Las contraseñas no coinciden');
    } else {
        clearError(input, errorElement);
    }
    
    return isValid;
}

/**
 * Muestra un mensaje de error para un campo
 */
function showError(input, errorElement, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Limpia el error de un campo
 */
function clearError(input, errorElement) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

/**
 * Valida un email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valida un número de teléfono
 */
function validatePhone(phone) {
    // Acepta formatos comunes de teléfono chileno
    const re = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$|^(\+?56)?(\s?)(0?2)(\s?)\d{7}$/;
    return re.test(phone);
}