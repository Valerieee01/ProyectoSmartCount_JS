const listarProveedores = async () => {
    try {
        const envio = await fetch("http://localhost:3000/api/proveedores");
        const respuesta = await envio.json();
        return respuesta
      } catch (error) {
        console.error(error);
      }
    
}

export default listarProveedores;