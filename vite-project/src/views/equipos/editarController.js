import { encabezados } from "../../helpers/solicitudes";
import { editarEquipoController } from "./editarEquipoController.js";

export const editarControllerEqu = async (a) => {
  console.log(a);

  // declaracion de variables
  const numeroEquipo = document.querySelector("#numero_equipo");
  const placa = document.querySelector("#placa");
  const descripcion = document.querySelector("#descripcion");
  const id_cliente = document.querySelector("#id_cliente");

  // Solicitud a la API
  const request = await fetch(`http://localhost:3000/api/equipos/${a.id_equipo}`, {
    method: 'GET',
    headers: encabezados
  });
  const { data } = await request.json();


  //Llenando los campos
  numeroEquipo.value = data.numero_equipo;
  placa.value = data.placa;
  descripcion.value = data.descripcion;
  id_cliente.value = data.id_cliente;

  editarEquipoController(a)

}