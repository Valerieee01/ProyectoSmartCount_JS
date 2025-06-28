// src/utils/scrollAnimations.js
const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
    easing: "ease-in-out",
    reset: true,
};

let srInstance; // Variable para almacenar la instancia de ScrollReveal

export const initializeScrollReveal = () => {
    // Asegúrate de que ScrollReveal esté disponible globalmente
    if (typeof ScrollReveal !== 'undefined' && !srInstance) {
        srInstance = ScrollReveal(scrollRevealOption);
        console.log("ScrollReveal inicializado.");
    } else if (!srInstance) {
        console.error("ScrollReveal no está cargado. Asegúrate de que el script de la librería esté antes de main.js en tu HTML.");
    }
    return srInstance;
};

export const applyHomeAnimations = (sr) => {
    if (!sr) {
        console.error("No se puede aplicar animaciones: ScrollReveal no está inicializado.");
        return;
    }

    // Animaciones para la sección del encabezado (Header de la Home)
    sr.reveal(".header__image img", {
        ...scrollRevealOption,
        origin: "right",
    });
    sr.reveal(".header__content h1", {
        ...scrollRevealOption,
        delay: 500,
    });
    sr.reveal(".header__content p", {
        ...scrollRevealOption,
        delay: 1000,
    });
    sr.reveal(".header__content form", {
        ...scrollRevealOption,
        delay: 1500,
    });
    // Si .header__content .bar no existe, elimínalo
    sr.reveal(".header__content .bar", {
        ...scrollRevealOption,
        delay: 2000,
    });
    sr.reveal(".header__image__card", {
        duration: 1000,
        interval: 500,
        delay: 2500,
    });

    // Animaciones para las secciones de la Home
    sr.reveal(".section__header", { interval: 200 });
    sr.reveal(".about__content", { interval: 150 });
    sr.reveal(".about__image", { interval: 150, delay: 100 });
    sr.reveal(".service__card", { interval: 100 });
    sr.reveal(".responsible__text", { delay: 100 });
    sr.reveal(".responsible__image", { delay: 200 });
    sr.reveal(".contact__form", { delay: 100 });
};