document.addEventListener('DOMContentLoaded', function() {
    // Datos de regiones y comunas de Chile
    const regionesComunas = {
        "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
        "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara"],
        "Región de Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "San Pedro de Atacama"],
        "Región de Atacama": ["Copiapó", "Vallenar", "Caldera", "Chañaral", "Diego de Almagro"],
        "Región de Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"],
        "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
        "Región Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Puente Alto"],
        "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Machalí", "Santa Cruz"],
        "Región del Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes"],
        "Región del Ñuble": ["Chillán", "Chillán Viejo", "Bulnes", "San Carlos", "Coihueco"],
        "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "Chiguayante"],
        "Región de La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Victoria"],
        "Región de Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Los Lagos"],
        "Región de Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"],
        "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Aysén", "Puerto Cisnes", "Chile Chico", "Cochrane"],
        "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Torres del Paine", "Cabo de Hornos"]
    };
    
    // Obtener elementos del DOM
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    
    // Si no están presentes los elementos, salir
    if (!regionSelect || !comunaSelect) return;
    
    // Llenar el select de regiones
    for (const region in regionesComunas) {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    }
    
    // Evento para actualizar comunas cuando cambia la región
    regionSelect.addEventListener('change', function() {
        // Limpiar select de comunas
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        
        // Habilitar/deshabilitar según si hay región seleccionada
        if (this.value) {
            comunaSelect.disabled = false;
            
            // Llenar comunas según la región seleccionada
            const comunas = regionesComunas[this.value];
            comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        } else {
            comunaSelect.disabled = true;
        }
    });
});