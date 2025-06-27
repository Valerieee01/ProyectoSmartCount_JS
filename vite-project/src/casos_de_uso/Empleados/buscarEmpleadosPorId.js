const buscar_empleados_por_id = async (id) => {
    const solicitud = await fetch(`http://localhost:3000/api/empleados/${id}`);
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_empleados_por_id;
