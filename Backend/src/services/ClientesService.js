import Cliente from "../models/Cliente.js";

class ClienteService { 

  static async getClientes()
  { 
    try {
      const clienteInstance = new Cliente();
      const clientes = await clienteInstance.getAll();
      // Validamos si no hay clientes      
      if (clientes.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay clientes registrados",
        };
      }      
      // Retornamos las clientes obtenidas
      return {
        error: false,
        code: 200,
        message: "clientes obtenidos correctamente",
        data: clientes,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las clientes",
      };
    }
  }

  static async getClientesById(id) {
    try {
      const clienteInstance = new Cliente();
      const cliente = await clienteInstance.getById(id);
      // Validamos si no hay clientes
      if (cliente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Clientes no encontrada",
        };
      }
      // Consultamos los productos asociados a la categoría
      const productos = await clienteInstance.productos(id);
      // Agregamos la propiedad productos al objeto categoría
      cliente.productos = productos;
      // Retornamos la categoría obtenida
      return {
        error: false,
        code: 200,
        message: "Categoría obtenida correctamente",
        data: cliente,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la categoría",
      };
    }
  }

  static async createCliente(id_persona) {
    try {
      const clienteInstance = new Cliente();
      const cliente = await clienteInstance.create(id_persona);
      // Validamos si no se pudo crear la categoría      
      if (cliente === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la cliente",
        };
      }   
      // Retornamos la nueva cliente creada
      return {
        error: false,
        code: 201,
        message: "cliente creada correctamente",
        data: cliente,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la cliente",
      };
    }
  }

  static async updateCliente(id, campos) { 
    try {
      const ClienteInstance = new Cliente();
      // Consultamos la cliente por id
      const ClienteExistente = await ClienteInstance.getById(id);
      // Validamos si no existe la cliente
      if (ClienteExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "cliente no encontrada",
        };
      }
      const Cliente = await ClienteInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la cliente
      if (Cliente === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la cliente",
        };
      }      
      // Retornamos la cliente actualizada
      return {
        error: false,
        code: 200,
        message: "cliente actualizada correctamente",
        data: Cliente,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la cliente",
      };
    } 
  }

  static async deleteCliente(id) { 
    try {
      const ClienteInstance = new Cliente();
      // Consultamos el cliente por id
      const ClienteExistente = await ClienteInstance.getById(id);
      // Validamos si no existe el cliente
      if (ClienteExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "cliente no encontrada",
        };
      }
   
      // Procedemos a eliminar el cliente      
      const resultado = await ClienteInstance.delete(id); 
      // Validamos si no se pudo eliminar el cliente
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
        message: "Cliente eliminado correctamente",
        data: ClienteExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el cliente",
      };
    }
  }

}

export default ClienteService;