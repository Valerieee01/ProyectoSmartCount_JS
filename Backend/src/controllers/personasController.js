import { ResponseProvider } from "../providers/ResponseProvider.js";
import PersonaService from "../services/PersonasServices.js";

class PersonaController {

  // Obtener todas los Personas
  static getAllPersonas = async (req, res) => {    
    try {
      // Llamamos al servicio para obtener los Personas
      const response = await PersonaService.getPersonas();   
      // Validamos si no hay Personas
      if (response.error) {        
        // Llamamos el persona para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el persona para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
       }
    } catch (error) {
      // Llamamos el persona para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Obtener una categoría por su ID
  static getPersonasById = async (req, res) => {
    const { id } = req.params;
    
    try {
      // Llamamos al servicio para obtener la categoría por su ID
      const response = await PersonaService.getPersonasById(id);
      if (response.error) {
        // Llamamos el persona para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {        
        // Llamamos el persona para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el persona para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Crear una nueva persona
  static createPersona = async (req, res) => {
    const { numero_persona, placa, descripcion, id_cliente } = req.body;
    try {
      const response = await PersonaService.createPersona(
        numero_persona, placa, descripcion, id_cliente
      );
      if (response.error) {
        // Llamamos el persona para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el persona para centralizar los mensajes de respuesta
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el persona para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Actualizar una categoría
  static updatePersona = async (req, res) => {
    const { id } = req.params;
    // Los campos a actualizar se pasan en el cuerpo de la solicitud
    const campos = req.body;
    try {
      // Crear una instancia de la clase Categoria
      const clientes = await PersonaService.updatePersona(id, campos);
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
      // Llamamos el persona para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

  // Eliminar un persona
  static deletePersona = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la persona
      const response = await PersonaService.deletePersona(id);
      if (response.error) {
        // Llamamos el persona para centralizar los mensajes de respuesta
        ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el persona para centralizar los mensajes de respuesta
        ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      // Llamamos el persona para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  };

}
export default PersonaController;
