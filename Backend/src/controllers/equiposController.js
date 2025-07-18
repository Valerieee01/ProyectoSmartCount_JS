import { ResponseProvider } from "../providers/ResponseProvider.js";
import EquipoService from "../services/EquipoServices.js";

class EquiposController {

  // Obtener todas las equipos
  static getAllEquipos = async (req, res) => {
    try {
      // Llamamos al servicio para obtener las equipos
      const response = await EquipoService.getEquipos();
      // Validamos si no hay equipos
      if (response.error) {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el equipo para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el equipo para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Obtener una categoría por su ID
  static getEquiposById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener la categoría por su ID
      const response = await EquipoService.getEquiposById(id);
      if (response.error) {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el equipo para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Crear una nueva categoría
  static createEquipos = async (req, res) => {
    const { numero_equipo, placa, descripcion, id_cliente } = req.body;
    try {
      const response = await EquipoService.createEquipo(
        numero_equipo, placa, descripcion, id_cliente
      );
      if (response.error) {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el equipo para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Actualizar una categoría
  static updateEquipos = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await EquipoService.updateEquipo(id, campos);
      // Validamos si no se pudo actualizar la categoría
      if (clientes.error) {
        ResponseProvider.error(
          res,
          clientes.message,
          clientes.code
        );
      }
      // Retornamos la respuesta cuando se actualiza correctamente
      ResponseProvider.success(
        res,
        clientes.data,
        clientes.message,
        clientes.code
      );
    } catch (error) {      
      // Llamamos el equipo para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar un equipo
  static deleteEquipos = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la categoría
      const response = await EquipoService.deleteEquipo(id);
      if (response.error) {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el equipo para centralizar los mensajes de respuesta
        ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el equipo para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

}
export default EquiposController;
