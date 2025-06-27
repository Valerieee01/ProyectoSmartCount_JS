export const eliminar_pagos_por_id = async (id) => {
    fetch(`http://localhost:3000/api/pagos/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_pagos_por_id;