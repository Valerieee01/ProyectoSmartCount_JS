import { ResponseProvider } from "../providers/ResponseProvider.js";
import ProveedorService from "../services/ProveedorService.js";

class ProveedorController {

  // Obtener todas los Proveedors
  static getAllProveedores = async (req, res) => {    
    try {
      // Llamamos al servicio para obtener los Proveedors
      const response = await ProveedorService.getProveedores();   
      // Validamos si no hay Proveedors
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

  // Obtener una categoría por su ID
  static getProveedoresById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener la categoría por su ID
      const response = await ProveedorService.getProveedoresById(id);
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
  static createProveedor = async (req, res) => {
    const { numero_mantenimiento, placa, descripcion, id_cliente } = req.body;
    try {
      const response = await ProveedorService.createProveedor(
        numero_mantenimiento, placa, descripcion, id_cliente
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
  static updateProveedor = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await ProveedorService.updateProveedor(id, campos);
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
      // Llamamos el mantenimiento para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar un mantenimiento
  static deleteProveedor = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la categoría
      const response = await ProveedorService.deleteProveedor(id);
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
export default ProveedorController;
