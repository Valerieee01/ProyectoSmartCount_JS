import { error, success } from "../../helpers/alerts.js";
import { setData } from "../../helpers/auth.js";
import { encabezados } from "../../helpers/solicitudes.js"
export const loginController = (container) => {
  
  // Declaración de variables
  const divForm = container.querySelector(".login");
  const form = divForm.querySelector("form");
  const correo = divForm.querySelector("#correo");
  const contrasena = divForm.querySelector("#contrasena");
  
  // Declaración de métodos
  const enviar = async (e) => {
    e.preventDefault();
    const data = {
      correo: correo.value,
      contrasena: contrasena.value,
    };
    console.log(data);
    
    
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
