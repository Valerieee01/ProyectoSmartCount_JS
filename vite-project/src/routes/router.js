// src/routes/router.js

import { loadView } from "../helpers/loadView.js";
import { clienteController } from "../views/cliente/clienteController.js";
import { empleadoController } from "../views/empleado/EmpleadoController.js";
import { initEquiposController } from "../views/equipos/equiposController.js";
import { inicioController } from "../views/inicio/inicioAuthController.js";
import { loginRegisterController } from "../views/login_register/loginRegisterController.js";
import { mantenimientoController } from "../views/mantenimiento/mtoController.js";
import { pagosController } from "../views/pagos/pagosController.js";
import { reportesController } from "../views/reportes/reportesController.js";
import { estaAutenticado } from "../helpers/auth.js";
import { proveedoresController } from "../views/proveedores/proveedoresController.js";
import { initUserProfile } from "../views/user/userController.js";
import { editarControllerProveedor } from "../views/proveedores/editarProveedor.js";
import { editarControllerEmp } from "../views/empleado/editarController.js";
import { initCrearClienteForm } from "../views/cliente/crearClienteController.js";
import { personasController } from "../views/personas/PersonasController.js";
import { editarControllerPer } from "../views/personas/editarControllerPer.js";
import { crearPersonaController } from "../views/personas/crearPersonaController.js";
import { initCrearEmpleadoForm } from "../views/empleado/crearEmpleadoController.js";
import { initCrearProveedoresForm } from "../views/proveedores/crearProveedoresController.js";
import { editarControllerEqu } from "../views/equipos/editarController.js";
import { editarControllerCat } from "../views/cliente/editarController.js";

const routes = {
  "home": {
    template: "home/index.html",
    controlador: inicioController,
    private: false,
  },
  "login": {
    template: "login_register/index.html",
    controlador: loginRegisterController,
    private: false,
  },
  "registro": {
    template: "login_register/index.html",
    controlador: loginRegisterController,
    private: false,
  },
  "inicio": {
    template: "inicio/index.html",
    controlador: inicioController,
    private: true,
  },
  "cliente": {
    template: "cliente/index.html",
    controlador: clienteController,
    private: true,
  },
  "editarcliente/:id": {
    template: "cliente/editarCliente.html",
    controlador: editarControllerCat,
    private: true,
  },
  "crearCliente": {
    template: "cliente/crearCliente.html",
    controlador: initCrearClienteForm,
    private: true,
  },
  "empleado": {
    template: "empleado/index.html",
    controlador: empleadoController,
    private: true,
  },
  "editarEmpleado/:id": {
    template: "empleado/editarEmpleado.html",
    controlador: editarControllerEmp,
    private: true,
  },
  "crearEmpleados": {
    template: "empleado/crearEmpleado.html",
    controlador: initCrearEmpleadoForm,
    private: true,
  },
  "equipos": {
    template: "equipos/index.html",
    controlador: initEquiposController,
    private: true,
  },
  "editarEquipo/:id": {
    template: "equipos/editarEquipo.html",
    controlador: editarControllerEqu,
    private: true,
  },
  "crearEquipo": {
    template: "equipos/crearEquipo.html",
    controlador: initEquiposController,
    private: true,
  },
  "mantenimiento": {
    template: "mantenimiento/index.html",
    controlador: mantenimientoController,
    private: true,
  },
  "pagos": {
    template: "pagos/index.html",
    controlador: pagosController,
    private: true,
  },
  "proveedores": {
    template: "proveedores/index.html",
    controlador: proveedoresController,
    private: true,
  },
  "editarProveedores/:id": {
    template: "proveedores/editarProveedor.html",
    controlador: editarControllerProveedor,
    private: true,
  },
  "crearProveedores": {
    template: "proveedores/crearProveedores.html",
    controlador: initCrearProveedoresForm,
    private: true,
  },
  "reportes": {
    template: "reportes/index.html",
    controlador: reportesController,
    private: true,
  },
  "usuario": {
    template: "user/index.html",
    controlador: initUserProfile,
    private: true,
  }, "personas": {
    template: "personas/index.html",
    controlador: personasController,
    private: true,
  },
  "editarPersona/:id": {
    template: "personas/editarPersona.html",
    controlador: editarControllerPer,
    private: true,
  },
  "crearPersonas": {
    template: "personas/crearPersona.html",
    controlador: crearPersonaController,
    private: true,
  },
  // Agrega más rutas aquí si es necesario
};

export const router = async (appContainer) => {
  const hash = location.hash.slice(1);
  const [rutas, params] = matchRoute(hash);

  const headerContainer = document.getElementById('header-container');

  if (!rutas && !estaAutenticado()) {
    // Si no hay ruta, o si la ruta es inválida, redirige a 'home'
    location.hash = "#home";
    return; // Salir para que el hashchange vuelva a llamar al router con la ruta correcta
  } else if (!rutas && estaAutenticado()) {
    location.hash = "#inicio";
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

  if (rutas.private && !estaAutenticado()) {
    location.hash = "#login";
    return;
  }

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