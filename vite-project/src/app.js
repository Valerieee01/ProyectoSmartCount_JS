import header from "./componentes/header.js";
import "./style.css";
import { router } from "./routes/router.js";

const nav = document.querySelector('.nav_menu');
header(nav); // Renderiza el header/nav menu dinámicamente

const divApp = document.querySelector('#app-content');

// Inicializar los listeners del menú DESPUÉS de que header(nav) lo haya creado
const initializeMenuListeners = () => {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    const menuBtnIcon = menuBtn ? menuBtn.querySelector('i') : null;

    if (!menuBtn || !navLinks || !menuBtnIcon) {
        console.error("Error: Elementos del menú no encontrados. Asegúrate de que el header se renderiza antes de inicializar los listeners.");
        return;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuBtnIcon.setAttribute('class', 'ri-menu-line');
            }
        });
    });

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
    });
};
initializeMenuListeners(); // Llama a la función de inicialización del menú



// Router event listeners
window.addEventListener('DOMContentLoaded', () => {
    router(divApp); // Carga la vista inicial
});

window.addEventListener('hashchange', () => {
    router(divApp); // Carga la vista cuando cambia el hash
});