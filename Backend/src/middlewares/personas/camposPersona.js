import { ResponseProvider } from "../../providers/ResponseProvider.js";
import { campos } from "./campos.js";

export function camposPersona(req, res, next) {
  // Arreglo para almacenar los errores de validación
  const errors = [];
  // Validar cada campo según las reglas definidas
  // Recorremos el arreglo de campos a validar
  for (const campo of campos) {
    const {
      name, // Nombre del campo a validar
      required, // Si el campo es requerido
      minLength, // si el campo tiene un tamaño mínimo
      maxLength, // si el campo tiene un tamaño máximo
    } = campo;

    const value = req.body[name];

    const trimmedValue = (typeof value === 'string') ? value.trim() : value;

    // 1. Validación de campos requeridos:
    // El campo es requerido Y su valor es considerado vacío (null, undefined, "" después de trim).
    if (required && (trimmedValue === "" || trimmedValue === null || trimmedValue === undefined)) {
      errors.push({
        campo: name,
        message: `El campo '${name}' es obligatorio y no puede estar vacío.`,
      });
      continue; // Pasa al siguiente campo si este es requerido y está vacío.
    }

    // Si el campo no es requerido y su valor es null/undefined, no se valida más.
    if (!required && (value === null || value === undefined)) {
      continue;
    }

    // 2. Validaciones de longitud (solo aplican a strings):
    if (typeof trimmedValue === 'string') {
      if (minLength && trimmedValue.length < minLength) {
        errors.push({
          campo: name,
          message: `El campo '${name}' debe tener al menos ${minLength} caracteres.`,
        });
        continue;
      }
      if (maxLength && trimmedValue.length > maxLength) {
        errors.push({
          campo: name,
          message: `El campo '${name}' no puede tener más de ${maxLength} caracteres.`,
        });
        continue;
      }
    }
  }
  // Si hay errores, devolver una respuesta con los errores
  if (errors.length > 0) {
    // Retornamos y Llamamos el provider para centralizar los mensajes de respuesta
    return ResponseProvider.error(
      res,
      "Error de validación",
      400,
      errors
    );
  }
  // Si todo está bien, pasamos al siguiente middleware o controlador
  next();
}
