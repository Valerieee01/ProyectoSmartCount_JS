import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";
import { encabezados } from "../../helpers/solicitudes.js";
import { editarEquipoController } from "./editarEquipoController.js";

export const editarControllerEqu = async (a) => {
  console.log(a);

  // declaracion de variables
  const numeroEquipo = document.querySelector("#numero_equipo");
  const placa = document.querySelector("#placa");
  const descripcion = document.querySelector("#descripcion");
  const selectPersonaExistente = document.querySelector("#id_cliente");
  
  if (selectPersonaExistente) {
    try {
      const response = await listarClientes();
      const clientes = response.data;

      if (clientes && clientes.length > 0) {
        clientes.forEach(cliente => {
          const option = document.createElement('option');
          option.value = cliente.id_persona;
          option.textContent = cliente.nombre_completo_razon_social;
          selectPersonaExistente.appendChild(option);
        });
        console.log("[initCreaEmpleadoeForm] Select 'id_persona_existente' cargado con", clientes.length, "clientes.");
      } else {
        console.log("[initCreaEmpleadoeForm] No se encontraron clientes para cargar en el select.");
      }
    } catch (error) {
      console.error("[initCreaEmpleadoeForm] Error al cargar clientes para el select:", error);
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar Empleados";
      selectPersonaExistente.appendChild(option);
      selectPersonaExistente.disabled = true;
    }
  }

  // Solicitud a la API
  const request = await fetch(`http://localhost:3000/api/equipos/${a.id}`, {
    method: 'GET',
    headers: encabezados
  });
  console.log(request);
  
  const { data } = await request.json();
  console.log(data);


  //Llenando los campos
  numeroEquipo.value = data.numero_equipo;
  placa.value = data.placa;
  descripcion.value = data.descripcion;
  selectPersonaExistente.value = data.id_cliente;

  editarEquipoController(a)

}