const buscar_proveedores_por_id = async (id) => {
    const solicitud = await fetch(`http://localhost:3000/api/proveedores/${id}`);
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_proveedores_por_id;

