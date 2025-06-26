import { ResponseProvider } from "../providers/ResponseProvider.js";
import PagoService from "../services/PagosServices.js";

class PagoController {

  // Obtener todas los Pagos
  static getAllPagos = async (req, res) => {    
    try {
      // Llamamos al servicio para obtener los Pagos
      const response = await PagoService.getPagos();   
      // Validamos si no hay Pagos
      if (response.error) {        
        // Llamamos el pago para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el pago para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
       }
    } catch (error) {
      // Llamamos el pago para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Obtener una pagos por su ID
  static getPagosById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener la pagos por su ID
      const response = await PagoService.getPagosById(id);
      if (response.error) {
        // Llamamos el pago para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {        
        // Llamamos el pago para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el pago para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Crear una nueva pago
  static createPago = async (req, res) => {
    const { numero_pago, placa, descripcion, id_cliente } = req.body;
    try {
      const response = await PagoService.createPago(
        numero_pago, placa, descripcion, id_cliente
      );
      if (response.error) {
        // Llamamos el pago para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el pago para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el pago para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Actualizar una categoría
  static updatePago = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await PagoService.updatePago(id, campos);
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
      // Llamamos el pago para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar un pago
  static deletePago = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la pago
      const response = await PagoService.deletePago(id);
      if (response.error) {
        // Llamamos el pago para centralizar los mensajes de respuesta
        ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el pago para centralizar los mensajes de respuesta
        ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el pago para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

}
export default PagoController;
