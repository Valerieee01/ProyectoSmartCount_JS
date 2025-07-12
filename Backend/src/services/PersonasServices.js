import Persona from "../models/Persona.js";

class PersonaService { 

  static async getPersonas()
  { 
    try {
      const personaInstance = new Persona();
      const personas = await personaInstance.getAll();
      // Validamos si no hay personas      
      if (personas.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay personas registrados",
        };
      }      
      // Retornamos las personas obtenidas
      return {
        error: false,
        code: 200,
        message: "personas obtenidos correctamente",
        data: personas,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las personas",
      };
    }
  }

  static async getPersonasById(id) {
    try {
      const personaInstance = new Persona();
      const personas = await personaInstance.getById(id);
      // Validamos si no hay personas
      if (personas.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Personas no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "persona obtenido correctamente",
        data: personas,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la persona",
      };
    }
  }

  static async createPersona(id_persona) {
    try {
      const personaInstance = new Persona();
      const personas = await personaInstance.create(id_persona);
      // Validamos si no se pudo crear la persona      
      if (personas === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la persona",
        };
      }   
      // Retornamos la nueva persona creada
      return {
        error: false,
        code: 201,
        message: "persona creada correctamente",
        data: personas,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la persona",
      };
    }
  }

  static async updatePersona(id, campos) { 
    try {
      const PersonaInstance = new Persona();
      // Consultamos la persona por id
      const PersonaExistente = await PersonaInstance.getById(id);
      // Validamos si no existe la persona
      if (PersonaExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "persona no encontrada",
        };
      }
      const Persona = await PersonaInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la persona
      if (Persona === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la persona",
        };
      }      
      // Retornamos la persona actualizada
      return {
        error: false,
        code: 200,
        message: "persona actualizada correctamente",
        data: Persona,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la persona",
      };
    } 
  }

  static async deletePersona(id) { 
    try {
      const PersonaInstance = new Persona();
      // Consultamos el persona por id
      const PersonaExistente = await PersonaInstance.getById(id);
      // Validamos si no existe el persona
      if (PersonaExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "persona no encontrada",
        };
      }
   
      // Procedemos a eliminar el persona      
      const resultado = await PersonaInstance.delete(id); 
      // Validamos si no se pudo eliminar el persona
      if (resultado.error) {
        return {
          error: true,
          code: 400,
          message: resultado.mensaje,
        };
      }      
      // Retornamos la respuesta de eliminación
      return {
        error: false,
        code: 200,
        message: "Persona eliminado correctamente",
        data: PersonaExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el persona",
      };
    }
  }

}

export default PersonaService;
