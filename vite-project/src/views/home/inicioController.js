
import { initializeScrollReveal, applyHomeAnimations } from "../../utils/scrollAnimations.js";

export const inicioController = (params = {}) => {
    console.log("Controlador de Inicio cargado para FixMaster.");

    // Esto asegura que los elementos ya estén en el DOM cuando ScrollReveal los busque
    const sr = initializeScrollReveal(); // Obtiene o inicializa la instancia de ScrollReveal
    if (sr) {
        applyHomeAnimations(sr); 
    }
};