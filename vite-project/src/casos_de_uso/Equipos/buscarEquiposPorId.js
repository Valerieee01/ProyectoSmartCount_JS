const buscar_equipo_por_id = async (id) => {
    const solicitud = await fetch(`http://localhost:3000/api/equipos/${id}`);
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_equipo_por_id;

