// src/middlewares/pagos/camposPagos.js

import { ResponseProvider } from "../../providers/ResponseProvider.js";
import { campos } from "./campos.js"; // Importa la definición de tus campos

export function camposPagos(req, res, next) {
  const errors = [];
  const bodyKeys = Object.keys(req.body);

  // Recorremos el arreglo de campos a validar
  for (const campoConfig of campos) {
    const { name, required, minLength, maxLength, type } = campoConfig; // Desestructuramos 'type'
    const value = req.body[name]; // Valor recibido del body


    // Aplicar .trim() solo si el valor es un string.
    // Si no es un string 'trimmedValue' será el valor original.
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
    // Esto es importante para campos opcionales que no se envían.
    if (!required && (value === null || value === undefined)) {
      continue;
    }

    // 2. Validaciones de longitud (solo aplican a strings):
    if (type === 'string' && typeof trimmedValue === 'string') { // Solo si es de tipo string y es un string
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

    // 3. Validaciones de tipo de dato:
    if (type) {
      switch (type) {
        case 'number':
          // Si el valor no es null/undefined y no es un número válido.
          // value !== null && value !== undefined para permitir null/undefined en campos opcionales.
          if (value !== null && value !== undefined && isNaN(Number(value))) {
            errors.push({
              campo: name,
              message: `El campo '${name}' debe ser un número válido.`,
            });
          }
          break;
        case 'string':
          // Para fecha_facturacion (type: "string" en campos.js):
          if (name === 'fecha_facturacion' && typeof value === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            errors.push({
              campo: name,
              message: `El campo '${name}' debe tener el formato YYYY-MM-DD.`,
            });
          }
          break;

      }
    }
  }

  // Si hay errores, devolver una respuesta con los errores.
  if (errors.length > 0) {
    return ResponseProvider.error(res, "Error de validación", 400, errors);
  }
  // Si todo está bien, pasamos al siguiente middleware o controlador.
  next();
}