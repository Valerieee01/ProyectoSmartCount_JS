import { error, success } from "../../helpers/alerts.js";
import { setData } from "../../helpers/auth.js";
import { encabezados } from "../../helpers/solicitudes.js"
export const loginController = () => {
  // Declaración de variables
  const form = document.querySelector("form");
  const correo = document.querySelector("#correo");
  const contrasena = document.querySelector("#contrasena");
  
  // Declaración de métodos
  const enviar = async (e) => {
    e.preventDefault();
    const data = {
      email: correo.value,
      password: contrasena.value,
    };
    const request = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: encabezados
    });
    const response = await request.json();
    if (response.success) {
      form.reset();
      success(response);
      setData(response.data);
      location.hash = "#inicio";
      window.dispatchEvent(new CustomEvent("modificandoHeader", {}));
    } else {
      console.log(response);
      error(response);
    }
  };

  // Declaración de eventos
  form.addEventListener("submit", enviar);
};