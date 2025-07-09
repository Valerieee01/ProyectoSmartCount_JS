export const eliminar_proveedores_por_id = async (id) => {
    fetch(`http://localhost:3000/api/proveedores/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_proveedores_por_id;