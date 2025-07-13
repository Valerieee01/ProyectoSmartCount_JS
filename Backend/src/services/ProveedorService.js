import Proveedor from "../models/Proveedor.js";

class ProveedorService { 

  static async getProveedores()
  { 
    try {
      const proveedorInstance = new Proveedor();
      const proveedores = await proveedorInstance.getAll();
      // Validamos si no hay proveedores      
      if (proveedores.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay proveedores registrados",
        };
      }      
      // Retornamos las proveedores obtenidas
      return {
        error: false,
        code: 200,
        message: "proveedores obtenidos correctamente",
        data: proveedores,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las proveedores",
      };
    }
  }

  static async getProveedoresById(id) {
    try {
      const proveedorInstance = new Proveedor();
      const proveedores = await proveedorInstance.getById(id);
      // Validamos si no hay proveedores
      if (proveedores.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Proveedor no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "Proveedor obtenido correctamente",
        data: proveedores,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la Proveedor",
      };
    }
  }

  static async createProveedor(id_persona) {
    try {
      const proveedorInstance = new Proveedor();
      const proveedores = await proveedorInstance.create(id_persona);
      // Validamos si no se pudo crear la categoría      
      if (proveedores === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la Proveedor",
        };
      }   
      // Retornamos la nueva Proveedor creada
      return {
        error: false,
        code: 201,
        message: "Proveedor creada correctamente",
        data: proveedores,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la Proveedor",
      };
    }
  }

  static async updateProveedor(id, campos) { 
    try {
      const ProveedorInstance = new Proveedor();
      // Consultamos la Proveedor por id
      const ProveedorExistente = await ProveedorInstance.getById(id);
      // Validamos si no existe la Proveedor
      if (ProveedorExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Proveedor no encontrada",
        };
      }
      const Proveedor = await ProveedorInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la Proveedor
      if (Proveedor === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la Proveedor",
        };
      }      
      // Retornamos la Proveedor actualizada
      return {
        error: false,
        code: 200,
        message: "Proveedor actualizada correctamente",
        data: Proveedor,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la Proveedor",
      };
    } 
  }

  static async deleteProveedor(id) { 
    try {
      const ProveedorInstance = new Proveedor();
      
      // Consultamos el Proveedor por id
      const ProveedorExistente = await ProveedorInstance.getById(id);
      
      // Validamos si no existe el Proveedor
      if (ProveedorExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Proveedor no encontrada",
        };
      }
   
      // Procedemos a eliminar el Proveedor      
      const resultado = await ProveedorInstance.delete(id); 
      // Validamos si no se pudo eliminar el Proveedor
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
        message: "Proveedor eliminado correctamente",
        data: ProveedorExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el Proveedor",
      };
    }
  }

}

export default ProveedorService;
