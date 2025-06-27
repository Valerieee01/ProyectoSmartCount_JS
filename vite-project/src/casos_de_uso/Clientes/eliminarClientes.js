export const eliminar_clientes_por_id = async (id) => {
    fetch(`http://localhost:3000/api/clientes/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_clientes_por_id;