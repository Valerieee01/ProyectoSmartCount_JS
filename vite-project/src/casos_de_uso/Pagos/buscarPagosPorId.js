const buscar_pagos_por_id = async (id) => {
    const solicitud = await fetch(`http://localhost:3000/api/pagos/${id}`);
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_pagos_por_id;

