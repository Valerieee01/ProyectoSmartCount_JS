// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla } from "./mostrarTabla.js"; 
import listarPersonas from "../../casos_de_uso/Personas/listarPersonas.js";

export const initCrearClienteForm = async () => { 
    console.log("[initCrearClienteForm] Inicializando envío de formulario para nuevo cliente...");

    const form = document.querySelector('#clientForm');
    const selectPersonaExistente = document.getElementById('id_persona_existente'); 

    if (!form) {
        console.error("[initCrearClienteForm] Error: Formulario '#clientForm' no encontrado en el DOM.");
        return;
    }

    if (selectPersonaExistente) {
        try {
            const response = await listarPersonas(); 
            const personas = response.data; 

            if (personas && personas.length > 0) {
                personas.forEach(persona => {
                    const option = document.createElement('option');
                    option.value = persona.id_persona; 
                    option.textContent = persona.nombre_completo_razon_social; 
                    selectPersonaExistente.appendChild(option);
                });
                console.log("[initCrearClienteForm] Select 'id_persona_existente' cargado con", personas.length, "personas.");
            } else {
                console.log("[initCrearClienteForm] No se encontraron personas para cargar en el select.");
            }
        } catch (error) {
            console.error("[initCrearClienteForm] Error al cargar personas para el select:", error);
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Error al cargar personas";
            selectPersonaExistente.appendChild(option);
            selectPersonaExistente.disabled = true;
        }
    }

    const enviar = async (e) => {
        e.preventDefault(); 
        console.log("[initCrearClienteForm] Formulario de creación enviado.");

        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const idPersonaSeleccionada = selectPersonaExistente ? selectPersonaExistente.value : '';
        
        // --- Lógica crucial: Cómo construir 'data' ---
        if (idPersonaSeleccionada) {
            // Si se seleccionó una persona existente, ajusta 'data' para el backend.
            // Elimina los campos de 'persona' si el backend solo espera el ID para asociar.
            // (Asumo que 'id_persona' es la FK en tu tabla clientes que apunta a personas/usuarios).
            data.id_persona = idPersonaSeleccionada; 

       
            console.log("[initCrearClienteForm] Datos para crear cliente con persona existente (solo FK):", data);
        } else {
            console.log("[initCrearClienteForm] Datos para crear nuevo cliente/persona:", data);
            // Si no se selecciona una persona existente, 'data' contendrá todos los campos
            // para que el backend cree la persona y luego el cliente.
        }

        try {
            const request = await fetch('http://localhost:3000/api/clientes', { 
                method: 'POST',
                body: JSON.stringify(data), 
                headers: {
                    'Content-Type': 'application/json',
                    ...encabezados 
                },
            });
            const response = await request.json();

            if (response.success) {
                form.reset(); 
                Swal.fire({
                    title: '¡Muy bien!',
                    text: response.message || 'Cliente creado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                await cargar_tabla(); 
                location.hash = "#cliente"; 
            } else {
                console.error("[initCrearClienteForm] Error de la API:", response);   
                Swal.fire({
                    title: '¡Error!',
                    text: response.message || 'Ocurrió un error al crear el cliente.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }        
        } catch (error) {
            console.error("[initCrearClienteForm] Error al enviar el formulario (fetch):", error);
            Swal.fire({
                title: '¡Error!',
                text: `No se pudo conectar con el servidor: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    form.addEventListener('submit', enviar); 
};