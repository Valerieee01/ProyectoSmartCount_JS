import Mantenimiento from "../models/Mantenimiento.js";

class MantenimientoService { 

  static async getMantenimientos()
  { 
    try {
      const MantenimientoInstance = new Mantenimiento();
      const Mantenimientos = await MantenimientoInstance.getAll();
      // Validamos si no hay Mantenimientos      
      if (Mantenimientos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay Mantenimientos registrados",
        };
      }      
      // Retornamos las Mantenimientos obtenidas
      return {
        error: false,
        code: 200,
        message: "Mantenimientos obtenidos correctamente",
        data: Mantenimientos,
      };
    } catch (error) {     
      return {
        error: true,
        code: 500,
        message: "Error al obtener las Mantenimientos",
      };
    }
  }

  static async getMantenimientosById(id) {
    try {
      const MantenimientoInstance = new Mantenimiento();
      const Mantenimientos = await MantenimientoInstance.getById(id);
      // Validamos si no hay Mantenimientos
      if (Mantenimientos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Mantenimientos no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "Mantenimiento obtenido correctamente",
        data: Mantenimientos,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la Mantenimiento",
      };
    }
  }

  static async createMantenimiento(id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones) {
    try {
      const MantenimientoInstance = new Mantenimiento();
      const Mantenimientos = await MantenimientoInstance.create(id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones);
      // Validamos si no se pudo crear la categoría      
      if (Mantenimientos === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la Mantenimiento",
        };
      }   
      // Retornamos la nueva Mantenimiento creada
      return {
        error: false,
        code: 201,
        message: "Mantenimiento creada correctamente",
        data: Mantenimientos,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la Mantenimiento",
      };
    }
  }

  static async updateMantenimiento(id, campos) { 
    const MantenimientoInstance = new Mantenimiento();
    try {
      // Consultamos la Mantenimiento por id
      const MantenimientoExistente = await MantenimientoInstance.getById(id);
      // Validamos si no existe la Mantenimiento
      if (MantenimientoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Mantenimiento no encontrada",
        };
      }
      const Mantenimiento = await MantenimientoInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la Mantenimiento
      if (Mantenimiento === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la Mantenimiento",
        };
      }      
      // Retornamos la Mantenimiento actualizada
      return {
        error: false,
        code: 200,
        message: "Mantenimiento actualizada correctamente",
        data: Mantenimiento,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la Mantenimiento",
      };
    } 
  }

  static async deleteMantenimiento(id) { 
    try {
      const MantenimientoInstance = new Mantenimiento();
      // Consultamos el Mantenimiento por id
      const MantenimientoExistente = await MantenimientoInstance.getById(id);
      // Validamos si no existe el Mantenimiento
      if (MantenimientoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Mantenimiento no encontrada",
        };
      }
   
      // Procedemos a eliminar el Mantenimiento      
      const resultado = await MantenimientoInstance.delete(id); 
      // Validamos si no se pudo eliminar el Mantenimiento
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
        message: "Mantenimiento eliminado correctamente",
        data: MantenimientoExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el Mantenimiento, revise si tiene registros relacionados",
      };
    }
  }

}

export default MantenimientoService;
