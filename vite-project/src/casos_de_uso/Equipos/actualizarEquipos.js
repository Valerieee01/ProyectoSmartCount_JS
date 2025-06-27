const actualizar_equipos = (id, data) => {
  fetch(`http://localhost:3000/api/equipos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

}

export default actualizar_equipos;

