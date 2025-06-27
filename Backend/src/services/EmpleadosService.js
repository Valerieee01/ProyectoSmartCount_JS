import Empleado from "../models/Empleado.js";

class EmpleadoService { 

  static async getEmpleados()
  { 
    try {
      const empleadoInstance = new Empleado();
      const empleados = await empleadoInstance.getAll();
      // Validamos si no hay empleados      
      if (empleados.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay empleados registrados",
        };
      }      
      // Retornamos las empleados obtenidas
      return {
        error: false,
        code: 200,
        message: "empleados obtenidos correctamente",
        data: empleados,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las empleados",
      };
    }
  }

  static async getEmpleadosById(id) {
    try {
      const empleadoInstance = new Empleado();
      const empleados = await empleadoInstance.getById(id);
      // Validamos si no hay empleados
      if (empleados.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Empleados no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "empleado obtenido correctamente",
        data: empleados,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error al obtener la empleado",
      };
    }
  }

  static async createEmpleado(id_persona) {
    try {
      const empleadoInstance = new Empleado();
      const empleados = await empleadoInstance.create(id_persona);
      // Validamos si no se pudo crear la categoría      
      if (empleados === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la empleado",
        };
      }   
      // Retornamos la nueva empleado creada
      return {
        error: false,
        code: 201,
        message: "empleado creado correctamente",
        data: empleados,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la empleado",
      };
    }
  }

  static async updateEmpleado(id, campos) { 
    try {
      const EmpleadoInstance = new Empleado();
      // Consultamos la empleado por id
      const EmpleadoExistente = await EmpleadoInstance.getById(id);
      // Validamos si no existe la empleado
      if (EmpleadoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "empleado no encontrada",
        };
      }
      const Empleado = await EmpleadoInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la empleado
      if (Empleado === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la empleado",
        };
      }      
      // Retornamos la empleado actualizada
      return {
        error: false,
        code: 200,
        message: "empleado actualizada correctamente",
        data: Empleado,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la empleado",
      };
    } 
  }

  static async deleteEmpleado(id) { 
    try {
      const EmpleadoInstance = new Empleado();
      // Consultamos el empleado por id
      const EmpleadoExistente = await EmpleadoInstance.getById(id);
      // Validamos si no existe el empleado
      if (EmpleadoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "empleado no encontrada",
        };
      }
   
      // Procedemos a eliminar el empleado      
      const resultado = await EmpleadoInstance.delete(id); 
      // Validamos si no se pudo eliminar el empleado
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
        message: "Empleado eliminado correctamente",
        data: EmpleadoExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el empleado",
      };
    }
  }

}

export default EmpleadoService;
