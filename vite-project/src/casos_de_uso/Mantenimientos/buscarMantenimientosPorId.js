const buscar_mantenimientos_por_id = async (id) => {
    const solicitud = await fetch(`http://localhost:3000/api/mantenimientos/${id}`);
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_mantenimientos_por_id;

