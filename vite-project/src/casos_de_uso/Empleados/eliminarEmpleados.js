export const eliminar_empleados_por_id = async (id) => {
    fetch(`http://localhost:3000/api/empleados/${id}`, {
      method: 'DELETE',
    });
}

export default eliminar_empleados_por_id;
