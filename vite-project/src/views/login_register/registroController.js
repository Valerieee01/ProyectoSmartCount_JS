import { error, success } from "../../helpers/alerts";
export const registroController = (container) => {
    
  // Declaración de variables
  const divForm = container.querySelector(".register");
  const form = divForm.querySelector("form");
  const nombre = divForm.querySelector("#nombre");
  const correo = divForm.querySelector("#correo");
  const rol = divForm.querySelector("#rol");
  const contrasena = divForm.querySelector("#contrasena");

  

  // Declaración de métodos
  const enviar = async (e) => {
    e.preventDefault();
    const data = {
      nombreCompleto: nombre.value,
      correo: correo.value,
      id_rol:rol.value,
      contrasena: contrasena.value,
    };
    const request = await fetch("http://localhost:3000/api/auth/registro", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const response = await request.json();
    if (response.success) {
      form.reset();
      success(response);
      location.hash = "#login";
    } else {
      console.log(response);
      error(response);
    }
  };

  // Declaración de eventos
  form.addEventListener("submit", enviar);
};
