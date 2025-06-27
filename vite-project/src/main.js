// Constantes para los elementos del menú y su icono
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

// ---

// Desplazamiento suave para los enlaces de navegación
// Itera sobre todos los enlaces cuyo href empieza con '#'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evita el comportamiento predeterminado del clic (el salto brusco)

        // Encuentra el elemento de destino usando el href del enlace y desplázate a él suavemente
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth' // Habilita el efecto de desplazamiento suave
        });

        // Si el menú móvil está abierto, se cierra y cambia el icono
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open'); // Remueve la clase 'open' para ocultar el menú
            menuBtnIcon.setAttribute('class', 'ri-menu-line'); // Cambia el icono a la hamburguesa
        }
    });
});

// ---

// Lógica para alternar el menú móvil al hacer clic en el botón
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open'); // Alterna la clase 'open' para mostrar/ocultar el menú

    // Cambia el icono del botón según el estado del menú
    const isOpen = navLinks.classList.contains('open');
    menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
});

// ---

// Configuración global para las animaciones de ScrollReveal
const scrollRevealOption = {
    distance: "50px", // Distancia de la animación
    origin: "bottom", // Origen de la animación (desde abajo)
    duration: 1000, // Duración de la animación en milisegundos
    easing: "ease-in-out", // Tipo de aceleración para la animación
    reset: true, // Reinicia la animación cada vez que el elemento entra en vista
};

// Crea una instancia de ScrollReveal con la configuración global
const scrollReveal = scrollReveal(scrollRevealOption);

// ---

// Animaciones para la sección del encabezado (Header)
scrollReveal.reveal(".header__image img", {
    ...scrollRevealOption, // Hereda las opciones globales
    origin: "right", // Sobrescribe el origen solo para esta animación
});

scrollReveal.reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 500, // Retraso antes de que empiece la animación
});

scrollReveal.reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 1000,
});

scrollReveal.reveal(".header__content form", {
    ...scrollRevealOption,
    delay: 1500,
});

scrollReveal.reveal(".header__content .bar", {
    ...scrollRevealOption,
    delay: 2000,
});

scrollReveal.reveal(".header__image__card", {
    duration: 1000,
    interval: 500, // Intervalo entre la animación de cada tarjeta
    delay: 2500,
});

// ---

// Animaciones para las nuevas secciones (Nosotros, Servicios, Responsable, Contacto)
scrollReveal.reveal(".section__header", { interval: 200 }); // Aplica animación a los encabezados de sección

scrollReveal.reveal(".about__content", { interval: 150 }); // Anima el contenido de "Nosotros"
scrollReveal.reveal(".about__image", { interval: 150, delay: 100 }); // Anima las imágenes de "Nosotros"

scrollReveal.reveal(".service__card", { interval: 100 }); // Anima cada tarjeta de servicio

scrollReveal.reveal(".responsible__text", { delay: 100 }); // Anima el texto de "Responsable"
scrollReveal.reveal(".responsible__image", { delay: 200 }); // Anima la imagen de "Responsable"

scrollReveal.reveal(".contact__form", { delay: 100 }); // Anima el formulario de "Contacto"