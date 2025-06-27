export const eliminar_mantenimientos_por_id = async (id) => {
    fetch(`http://localhost:3000/api/mantenimientos/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_mantenimientos_por_id;