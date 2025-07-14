import { refrescarAccessToken } from "../../helpers/solicitudesRefresh.js";
import { encabezados } from "../../helpers/solicitudes.js"
import { error, success } from "../../helpers/alerts.js";

export const eliminar_personas_por_id = async (id) => {
    const request = await fetch(`http://localhost:3000/api/personas/${id}`, {
        method: 'DELETE',
        headers: encabezados

    });
    const response = await request.json();
    // --- Paso 4: Manejar la respuesta del servidor ---
    if (response.success) {
        form.reset();
        success(response);
        forceReloadAllPeople()
        location.hash = "#personas";
    } else {
        console.error("Error de la API:", response);
        error(response);
    }
}

export default eliminar_personas_por_id;