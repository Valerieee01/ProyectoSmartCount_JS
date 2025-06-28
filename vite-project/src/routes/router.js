// src/routes/router.js

import { loadView } from "../helpers/loadView.js";
import { inicioController } from "../views/home/inicioController.js";
import { loginRegisterController } from "../views/login_register/loginRegisterController.js"; // Importa el nuevo controlador
// import { estaAutenticado } from "../helpers/auth.js"; // Descomenta si lo usas para rutas privadas

const routes = {
    "home": {
        template: "home/index.html",
        controlador: inicioController,
        private: false,
    },
    "login": { // Ruta para el inicio de sesión
        template: "login_register/index.html", // Nueva vista HTML
        controlador: loginRegisterController,
        private: false, // O true si quieres que solo se muestre si no está autenticado
    },
    "registro": { // Ruta para el registro (puede apuntar a la misma vista de login/registro)
        template: "login_register/index.html", // Misma vista HTML
        controlador: loginRegisterController,
        private: false,
    },
    // Agrega más rutas aquí si es necesario
};

export const router = async (appContainer) => {
    const hash = location.hash.slice(1);
    const [rutas, params] = matchRoute(hash);

    const headerContainer = document.getElementById('header-container'); 

    if (!rutas) {
        // Si no hay ruta, o si la ruta es inválida, redirige a 'home'
        location.hash = "#home";
        return; // Salir para que el hashchange vuelva a llamar al router con la ruta correcta
    }

    // Lógica para mostrar/ocultar el header
    if (rutas.template === "login_register/index.html") {
        if (headerContainer) {
            headerContainer.style.display = 'none'; // Oculta el header
        }
        
    } else {
        if (headerContainer) {
            headerContainer.style.display = 'block'; // Muestra el header
        }
    
    }

    // if (rutas.private && !estaAutenticado()) {
    //     location.hash = "#login";
    //     return;
    // }

    // Carga la vista
    await loadView(appContainer, rutas.template);

    // Ejecuta el controlador
    if (rutas.controlador) {
        rutas.controlador(params);
    }
};

const matchRoute = (hash) => {
    const arreglo = hash.split("/");

    for (const route in routes) {
        const b = route.split("/");

        if (b.length !== arreglo.length) continue;

        const params = {};

        const matched = b.every((parte, i) => {
            if (parte.startsWith(":")) {
                const partName = parte.slice(1);
                const value = arreglo[i];
                params[partName] = value;
                return true;
            }
            return parte === arreglo[i];
        });

        if (matched) {
            return [routes[route], params];
        }
    }
    return [null, null];
};