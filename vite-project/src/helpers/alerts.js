import Swal from "sweetalert2";

export const success = (response) => {

  Swal.fire({
    title: "¡Muy bien!",
    text: response.message || "Operación realizada con éxito.",
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const error = (response) => {
  let errorMessage = "Ha ocurrido un error desconocido.";

  // Primero, verifica si hay un mensaje general de error en la respuesta
  if (response.message) {
    errorMessage = response.message;
  }
  console.log(errorMessage);
  
  // Luego, verifica si existe el array de errores (erros con una sola 'r')
  // y si contiene elementos.
  if (response.erros && Array.isArray(response.erros) && response.erros.length > 0) {
    // Si hay un array de errores, construimos un mensaje detallado.
    errorMessage = response.erros.map(err => err.message).join('<br>');
    
  }

  Swal.fire({
    title: "¡Error!",
    html: errorMessage,
    icon: "error",
    confirmButtonText: "Entendido",
  });
};