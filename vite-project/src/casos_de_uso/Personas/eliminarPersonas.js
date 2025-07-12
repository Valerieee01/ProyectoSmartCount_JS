export const eliminar_personas_por_id = async (id) => {
    fetch(`http://localhost:3000/api/personas/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_personas_por_id;
