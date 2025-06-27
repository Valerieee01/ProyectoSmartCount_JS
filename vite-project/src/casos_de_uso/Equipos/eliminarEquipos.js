export const eliminar_equipos_por_id = async (id) => {
    fetch(`http://localhost:3000/api/equipos/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_equipos_por_id;