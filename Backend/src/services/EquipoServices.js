import Equipo from "../models/Equipo.js";

class EquipoService { 

  static async getEquipos()
  { 
    try {
      const EquipoInstance = new Equipo();
      const Equipos = await EquipoInstance.getAll();
      // Validamos si no hay Equipos      
      if (Equipos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay Equipos registrados",
        };
      }      
      // Retornamos las Equipos obtenidas
      return {
        error: false,
        code: 200,
        message: "Equipos obtenidos correctamente",
        data: Equipos,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las Equipos",
      };
    }
  }

  static async getEquiposById(id) {
    try {
      const EquipoInstance = new Equipo();
      const Equipos = await EquipoInstance.getById(id);
      // Validamos si no hay Equipos
      if (Equipos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Equipos no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "Equipo obtenido correctamente",
        data: Equipos,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la Equipo",
      };
    }
  }

  static async createEquipo(numero_equipo, placa, descripcion, id_cliente) {
    try {
      const EquipoInstance = new Equipo();
      const Equipos = await EquipoInstance.create(numero_equipo, placa, descripcion, id_cliente);
      // Validamos si no se pudo crear la categoría      
      if (Equipos === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la Equipo",
        };
      }   
      // Retornamos la nueva Equipo creada
      return {
        error: false,
        code: 201,
        message: "Equipo creada correctamente",
        data: Equipos,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la Equipo, verifica si ya existe",
      };
    }
  }

  static async updateEquipo(id, campos) { 
    const EquipoInstance = new Equipo();
    try {
      // Consultamos la Equipo por id
      const EquipoExistente = await EquipoInstance.getById(id);
      // Validamos si no existe la Equipo
      if (EquipoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Equipo no encontrada",
        };
      }
      const Equipo = await EquipoInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la Equipo
      if (Equipo === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la Equipo",
        };
      }      
      // Retornamos la Equipo actualizada
      return {
        error: false,
        code: 200,
        message: "Equipo actualizada correctamente",
        data: Equipo,
      };
    } catch (error) {   
      console.log(error);
         
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la Equipo",
      };
    } 
  }

  static async deleteEquipo(id) { 
    try {
      const EquipoInstance = new Equipo();
      // Consultamos el Equipo por id
      const EquipoExistente = await EquipoInstance.getById(id);
      // Validamos si no existe el Equipo
      if (EquipoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Equipo no encontrada",
        };
      }
   
      // Procedemos a eliminar el Equipo      
      const resultado = await EquipoInstance.delete(id); 
      // Validamos si no se pudo eliminar el Equipo
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
        message: "Equipo eliminado correctamente",
        data: EquipoExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el Equipo, verifica si tiene mantenimientos asociados",
      };
    }
  }

}

export default EquipoService;
