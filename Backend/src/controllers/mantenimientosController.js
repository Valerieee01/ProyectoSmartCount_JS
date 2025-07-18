import { ResponseProvider } from "../providers/ResponseProvider.js";
import MantenimientoService from "../services/MantenimientosServices.js";

class MantenimientoController {

  // Obtener todas los Mantenimientos
  static getAllMantenimientos = async (req, res) => {    
    try {
      // Llamamos al servicio para obtener los Mantenimientos
      const response = await MantenimientoService.getMantenimientos();   
      // Validamos si no hay Mantenimientos
      if (response.error) {        
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
       }
    } catch (error) {
            console.log(error);      

      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Obtener una categoría por su ID
  static getMantenimientosById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener el mantenimiento por su ID
      const response = await MantenimientoService.getMantenimientosById(id);
      if (response.error) {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {        
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Crear una nueva categoría
  static createMantenimiento = async (req, res) => {
    const { id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones } = req.body;
    try {
      const response = await MantenimientoService.createMantenimiento(
        id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones
      );
      if (response.error) {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Actualizar una categoría
  static updateMantenimiento = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await MantenimientoService.updateMantenimiento(id, campos);
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
      console.log(error);
      
      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar un mantenimiento
  static deleteMantenimiento = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la categoría
      const response = await MantenimientoService.deleteMantenimiento(id);
      if (response.error) {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el mantenimiento para centralizar los mensajes de respuesta
        ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

}
export default MantenimientoController;
