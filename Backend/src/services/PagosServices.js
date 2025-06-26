import Pago from "../models/Pago.js";

class PagoService { 

  static async getPagos()
  { 
    try {
      const PagoInstance = new Pago();
      const Pagos = await PagoInstance.getAll();
      // Validamos si no hay Pagos      
      if (Pagos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay Pagos registrados",
        };
      }      
      // Retornamos las Pagos obtenidas
      return {
        error: false,
        code: 200,
        message: "Pagos obtenidos correctamente",
        data: Pagos,
      };
    } catch (error) {      
      return {
        error: true,
        code: 500,
        message: "Error al obtener las Pagos",
      };
    }
  }

  static async getPagosById(id) {
    try {
      const PagoInstance = new Pago();
      const Pagos = await PagoInstance.getById(id);
      // Validamos si no hay Pagos
      if (Pagos.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Pagos no encontrada",
        };
      }

      return {
        error: false,
        code: 200,
        message: "Pago obtenido correctamente",
        data: Pagos,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error al obtener la Pago",
      };
    }
  }

  static async createPago(id_equipo) {
    try {
      const PagoInstance = new Pago();
      const Pagos = await PagoInstance.create(id_equipo);
      // Validamos si no se pudo crear la categoría      
      if (Pagos === null) {
        return {
          error: true,
          code: 400,
          message: "Error al crear la Pago",
        };
      }   
      // Retornamos la nueva Pago creada
      return {
        error: false,
        code: 201,
        message: "Pago creada correctamente",
        data: Pagos,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al crear la Pago",
      };
    }
  }

  static async updatePago(id, campos) { 
    try {
      const PagoInstance = new Pago();
      // Consultamos la Pago por id
      const PagoExistente = await PagoInstance.getById(id);
      // Validamos si no existe la Pago
      if (PagoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Pago no encontrada",
        };
      }
      const Pago = await PagoInstance.update(id, campos); 
      // Validamos si no se pudo actualizar la Pago
      if (Pago === null) {
        return {
          error: true,
          code: 400,
          message: "Error al actualizar la Pago",
        };
      }      
      // Retornamos la Pago actualizada
      return {
        error: false,
        code: 200,
        message: "Pago actualizada correctamente",
        data: Pago,
      };
    } catch (error) {
      return {
        error: true,
        code: 500,
        message: "Error interno al actualizar la Pago",
      };
    } 
  }

  static async deletePago(id) { 
    try {
      const PagoInstance = new Pago();
      // Consultamos el Pago por id
      const PagoExistente = await PagoInstance.getById(id);
      // Validamos si no existe el Pago
      if (PagoExistente.length === 0) {
        return {
          error: true,
          code: 404,
          message: "Pago no encontrada",
        };
      }
   
      // Procedemos a eliminar el Pago      
      const resultado = await PagoInstance.delete(id); 
      // Validamos si no se pudo eliminar el Pago
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
        message: "Pago eliminado correctamente",
        data: PagoExistente,
      };
    } catch (error) {
      console.log(error);
      
      return {
        error: true,
        code: 500,
        message: "Error interno al eliminar el Pago",
      };
    }
  }

}

export default PagoService;
