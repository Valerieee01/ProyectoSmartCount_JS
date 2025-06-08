
export const setData = async (data) => {
    try {
        console.log(data); 
        // await enviarDatosConEncabezados(data.accessToken, data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
    } catch (error) {
        console.error("Error setting data:", error);
    }
}


export const cleanLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export const getData = () => {
    
}

export const estaAutenticado = () => {
    if (localStorage.accessToken === undefined) {        
        // alert("Usuario no autenticado");
        return false
    }else{
        // alert("Usuario autenticado");
        return true;
    }
}
