import { loadView } from "../helpers/loadView.js";
// import { inicioController } from "../views/inicio/inicioController.js";
// import { registroController } from "../views/registro/registroController.js";
// import { loginController } from "../views/login_register/login_registerController.js";
// import { estaAutenticado } from "../helpers/auth.js";

  //  const routes = {
  //    home: {
  //      template: "home/index.html",
  //      controlador: loginController,
  //      private: false,
  //    },

  //  };

export const router = async (app) => {
  const hash = location.hash.slice(1);
  const [rutas, params] = matchRoute(hash);
  if (!rutas) {
    await loadView(app, "home/index.html");
    // inicioController();
    return;
  }

  if (rutas.private && !estaAutenticado()) {
    location.hash = "#login"
    return;
  }
  // Llamando la vista
  await loadView(app, rutas.template);
  // Ejecutar el controldor
  rutas.controlador(params);

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
      if (parte === arreglo[i]) {
        return true;
      }
    });

    if (matched) {
      return [routes[route], params];
    }
  }
  return [null, null];
};
