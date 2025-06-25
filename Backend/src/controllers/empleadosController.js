import { ResponseProvider } from "../providers/ResponseProvider.js";
import EmpleadoService from "../services/EmpleadosService.js";

class EmpleadosController {

  // Obtener todas las empleados
  static getAllEmpleados = async (req, res) => {    
    try {
      // Llamamos al servicio para obtener las empleados
      const response = await EmpleadoService.getEmpleados();   
      // Validamos si no hay empleados
      if (response.error) {        
        // Llamamos el empleado para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el empleado para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
       }
    } catch (error) {
      // Llamamos el empleado para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Obtener una categoría por su ID
  static getEmpleadosById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener la categoría por su ID
      const response = await EmpleadoService.getEmpleadosById(id);
      if (response.error) {
        // Llamamos el empleado para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {        
        // Llamamos el empleado para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el empleado para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Crear una nueva categoría
  static createEmpleados = async (req, res) => {
    const { id_persona } = req.body;
    try {
      const response = await EmpleadoService.createCliente(
        id_persona
      );
      if (response.error) {
        // Llamamos el empleado para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el empleado para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el empleado para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Actualizar una categoría
  static updateEmpleados = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await EmpleadoService.updateCliente(id, campos);
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
      // Llamamos el empleado para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar una categoría
  static deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la categoría
      const response = await EmpleadoService.deleteCliente(id);
      if (response.error) {
        // Llamamos el empleado para centralizar los mensajes de respuesta
        ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el empleado para centralizar los mensajes de respuesta
        ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el empleado para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

}
export default EmpleadosController;
