import header from "./componentes/header.js";
import asideBar from "./componentes/asideBar.js";
import "./style.css";
import { router } from "./routes/router.js";
import { estaAutenticado } from "./helpers/auth.js";

  


const headerContainer = document.getElementById("header-container");
const asideContainer = document.getElementById("aside-container");
const nav = document.querySelector(".nav_menu");
header(nav); // Renderiza el header/nav menu dinámicamente

const divApp = document.querySelector("#app-content");

// Inicializar los listeners del menú DESPUÉS de que header(nav) lo haya creado
const initializeMenuListeners = () => {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
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
        .querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
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

initializeMenuListeners(); 

window.addEventListener("modificandoHeader", (e) => {
    e.preventDefault();
    if (estaAutenticado()) {
        if (headerContainer) {
            headerContainer.remove() // Oculta el header si el aside lo reemplaza
        }
        if (asideContainer) {
            // Limpia el aside antes de re-renderizarlo para evitar duplicados si asideBar
            // no maneja el vaciado interno.
            asideContainer.innerHTML = '';
            asideBar(asideContainer, headerContainer);
        }
    } else {
        // Si ya no está autenticado, muestra el header y limpia el aside
        if (headerContainer) {
            headerContainer.style.display = 'block'; // Vuelve a mostrar el header
        }
        if (asideContainer) {
            asideContainer.innerHTML = ''; // Limpia el contenido del aside
        }
    }
  
});



// Router event listeners
window.addEventListener("DOMContentLoaded", () => {
  router(divApp); // Carga la vista inicial
});

window.addEventListener("hashchange", () => {
  router(divApp); // Carga la vista cuando cambia el hash
});


