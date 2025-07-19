import { ResponseProvider } from "../../providers/ResponseProvider.js";
import { campos } from "./campos.js"; // Importa la definición de tus campos para usuarios

export function camposUsuarios(req, res, next) {
  const errors = [];
  const bodyKeys = Object.keys(req.body); // Claves de los campos enviados en el cuerpo de la petición

  // Recorremos el arreglo de configuraciones de campos para validar.
  for (const campoConfig of campos) {
    const { name, required, minLength, maxLength, type } = campoConfig; // Desestructuramos la configuración del campo
    const value = req.body[name]; // Valor recibido del cuerpo de la petición

    // Si no es un string (ej. número, null, undefined), 'trimmedValue' será el valor original.
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
    // Solo aplica si el tipo definido es 'string' y el valor es realmente un string.
    if (type === 'string' && typeof trimmedValue === 'string') {
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

    // 3. Validaciones de tipo de dato (si definiste 'type' en 'campos.js'):
    if (type) {
      switch (type) {
        case 'number':
          // Si el valor no es null/undefined y no es un número válido.
          if (value !== null && value !== undefined && isNaN(Number(value))) {
            errors.push({
              campo: name,
              message: `El campo '${name}' debe ser un número válido.`,
            });
          }
          break;
      }
    }

    // Estas validaciones solo se aplican si el campo actual es 'contrasena'
    // y si el valor es un string no vacío (ya trimmeado).
    if (name === 'contrasena' && typeof trimmedValue === 'string' && trimmedValue !== '') {
      // Regex para al menos un número
      const hasNumber = /[0-9]/.test(trimmedValue);
      // Regex para al menos un carácter especial
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(trimmedValue);

      if (!hasNumber) {
        errors.push({
          campo: name,
          message: `La contraseña debe contener al menos un número.`,
        });
      }
      if (!hasSpecialChar) {
        errors.push({
          campo: name,
          message: `La contraseña debe contener al menos un carácter especial (ej. !@#$%^&*).`,
        });
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
