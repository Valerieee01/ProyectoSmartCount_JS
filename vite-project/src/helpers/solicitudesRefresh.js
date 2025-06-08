import { encabezados } from "./solicitudes";

export const refrescarAccessToken = async (method, endpoint) => {
  if (method === "GET") {
    const request = await fetch(endpoint, {
      method: method,
      headers: encabezados
    });
    const response = await request.json();
    if (response.success) {
      return response.data;
    } else {
      if (response.code === 403) {
        const resfreshToken = localStorage.getItem('refreshToken')
        const request = fetch(endpoint, {
          method : 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resfreshToken}`,
          }
        })
        const response = await request.json();
        console.log(response);
      }
    }
  }
};
