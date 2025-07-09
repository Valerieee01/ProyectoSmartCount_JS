import eliminar_empleados_por_id from "../../casos_de_uso/Empleados/eliminarEmpleados.js";
import listarEmpleados from "../../casos_de_uso/Empleados/listarEmpleados.js";

export const cargar_tabla = async (tabla) => {
    const empleados = await listarEmpleados();
    console.log(empleados);
    
    const tBody = tabla.querySelector("tbody");
    tBody.innerHTML = '';
    
    (empleados.data).forEach(empleado => {
        crearFila(empleado, tabla);
    });    
}

export const crearFila = ({id, nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono }, tabla) => {
    
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow(0);
    const tdNobre = tr.insertCell(0);
    const tdTipoId = tr.insertCell(1);
    const tdNumId = tr.insertCell(2);
    const tdCorreo = tr.insertCell(3);
    const tdtelefono = tr.insertCell(4);
    const tdBotonera = tr.insertCell(5); 

    // Agregar el contenido a las celdas
    tdNobre.textContent = nombre_completo_razon_social;
    tdTipoId.textContent = id_tipo_identificacion;
    tdNumId.textContent = numero_identificacion;
    tdCorreo.textContent = correo;
    tdtelefono.textContent = telefono
    
    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");
  
    btnEditar.setAttribute("data-id", id)
    btnEditar.setAttribute("href", `#editarcategoria/${id}`)

    btnEliminar.setAttribute("data-id", id)
  
    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";
  
    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--samall", "editar");
    btnEliminar.classList.add("btn", "btn--samall", "btn--danger", "eliminar");
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);
  
    tr.setAttribute("id", `user_${id}`);

}

export const agregarEventosBotones = async () => {
     const tabla = document.querySelector("#tableEmpleados");
        tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            if (confirm("¿Estás seguro de eliminar este Empleado?")) {
                await eliminar_empleados_por_id(e.target.dataset.id);
                await cargar_tabla(tabla); 
            }
        }
    });
};