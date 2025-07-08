import header from "./componentes/header.js";
import asideBar from "./componentes/asideBar.js";
import "./style.css";
import { router } from "./routes/router.js";
import { estaAutenticado } from "./helpers/auth.js"; // Asegúrate de que esta función lea de localStorage

const headerContainer = document.getElementById("header-container");
const asideContainer = document.getElementById("aside-container");

// Inicializamos navMenu aquí, pero lo trataremos de forma más flexible en renderAuthLayout
let navMenu = document.querySelector(".nav_menu"); // Lo seleccionamos si ya existe

const divApp = document.querySelector("#app-content");

// Inicializar los listeners del menú DESPUÉS de que header(nav) lo haya creado
const initializeMenuListeners = () => {
    // Asegúrate de que navMenu esté disponible aquí cuando se llama
    if (!navMenu) {
        console.warn("initializeMenuListeners: navMenu no está disponible, no se pueden inicializar los listeners.");
        return;
    }

    const menuBtn = navMenu.querySelector("#menu-btn"); // Busca dentro del navMenu
    const navLinks = navMenu.querySelector("#nav-links"); // Busca dentro del navMenu
    const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

    if (!menuBtn || !navLinks || !menuBtnIcon) {
        console.error(
            "Error: Elementos del menú no encontrados. Asegúrate de que el header se renderiza antes de inicializar los listeners."
        );
        return;
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document
                .querySelector(this.getAttribute("href"))
                .scrollIntoView({ behavior: "smooth" });
            if (navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                menuBtnIcon.setAttribute("class", "ri-menu-line");
            }
        });
    });

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuBtnIcon.setAttribute(
            "class",
            isOpen ? "ri-close-line" : "ri-menu-line"
        );
    });
};

// --- FUNCIÓN PARA RENDERIZAR EL ENCABEZADO/LATERAL ---
const renderAuthLayout = () => {
    console.log("--- renderAuthLayout ejecutado ---");
    console.log("Estado de autenticación:", estaAutenticado());

    if (estaAutenticado()) {
        console.log("Usuario AUTENTICADO: Ocultando header, mostrando aside.");
        // Si está autenticado, oculta el header y muestra el aside
        if (headerContainer) {
            console.log("headerContainer antes de ocultar/limpiar:", headerContainer.style.display);
            headerContainer.style.display = 'none'; // Oculta el contenedor del header
            headerContainer.innerHTML = ''; // Limpia su contenido si lo tenía
            console.log("headerContainer después de ocultar/limpiar:", headerContainer.style.display);
        } else {
            console.warn("headerContainer no encontrado.");
        }

        if (asideContainer) {
            console.log("asideContainer antes de mostrar/limpiar:", asideContainer.style.display);
            asideContainer.style.display = 'block'; // Asegura que el asideContainer sea visible
            asideContainer.innerHTML = ''; // Limpia el aside antes de re-renderizarlo
            asideBar(asideContainer); // Renderiza el aside
            console.log("asideContainer después de mostrar/renderizar:", asideContainer.style.display);
        } else {
            console.warn("asideContainer no encontrado.");
        }
    } else {
        console.log("Usuario NO AUTENTICADO: Mostrando header, ocultando aside.");
        // Si no está autenticado, muestra el header y limpia/oculta el aside

        // Primero, limpia y oculta el aside si existe
        if (asideContainer) {
            console.log("asideContainer antes de limpiar/ocultar:", asideContainer.style.display);
            asideContainer.innerHTML = ''; // Limpia su contenido
            asideContainer.style.display = 'none'; // Oculta el aside
            console.log("asideContainer después de limpiar/ocultar:", asideContainer.style.display);
        }

        // Asegúrate de que navMenu sea un elemento DOM válido para trabajar con él
        console.log("Estado actual de navMenu:", navMenu);
        console.log("navMenu está en el body?", document.body.contains(navMenu));

        if (!navMenu || !document.body.contains(navMenu)) {
            console.log("navMenu no existe o no está en el DOM. Creando uno nuevo.");
            // Si navMenu no existe o fue removido, lo creamos y lo adjuntamos a headerContainer
            navMenu = document.createElement('nav');
            navMenu.classList.add('nav_menu'); // Asegúrate de que tenga la clase correcta
            if (headerContainer) {
                headerContainer.append(navMenu);
                console.log("Nuevo navMenu adjuntado a headerContainer.");
            } else {
                console.error("headerContainer no encontrado para adjuntar navMenu.");
            }
        } else {
            console.log("navMenu ya existe y está en el DOM. Limpiando su contenido.");
            // Si navMenu ya existe y está en el DOM, solo limpia su contenido
            navMenu.innerHTML = '';
        }

        if (headerContainer) {
            console.log("headerContainer antes de mostrar:", headerContainer.style.display);
            headerContainer.style.display = 'block'; // Asegura que el contenedor del header sea visible
            console.log("headerContainer después de mostrar:", headerContainer.style.display);
        }

        header(navMenu); // Renderiza el header/nav menu dinámicamente dentro del navMenu
        console.log("Header renderizado en navMenu.");
        initializeMenuListeners(); // Inicializa los listeners del header
        console.log("Listeners del menú inicializados.");
    }
    console.log("--- Fin de renderAuthLayout ---");
};


// --- Listener para el evento 'modificandoHeader' ---
// Este evento se debe disparar cuando el estado de autenticación cambia (login/logout)
window.addEventListener("modificandoHeader", (e) => {
    e.preventDefault();
    renderAuthLayout(); // Llama a la función que decide qué renderizar
});


// --- Router event listeners ---
window.addEventListener("DOMContentLoaded", () => {
    renderAuthLayout(); // <--- LLAMADA CRÍTICA AQUÍ: Renderiza el layout inicial basado en autenticación
    router(divApp); // Carga la vista inicial
});

window.addEventListener("hashchange", () => {
    router(divApp); // Carga la vista cuando cambia el hash
});