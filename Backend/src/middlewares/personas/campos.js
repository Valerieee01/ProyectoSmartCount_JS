export const campos = [
  { name: "nombres", required: true, minLength: 6, maxLength: 40 },
  { name: "apellidos", required: true, minLength: 6, maxLength: 100 },
  { name: "id_tipo_identificacion", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "numero_identificacion", required: true, minLength: 6, maxLength: 100 },
  { name: "correo", required: true, minLength: 6, maxLength: 100 },
  { name: "telefono", required: true, minLength: 6, maxLength: 100 },
  { name: "direccion", required: true, minLength: 6, maxLength: 100 },
];
