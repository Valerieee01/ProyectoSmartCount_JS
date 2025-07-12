export const campos = [
  { name: "nombre_completo_razon_social", required: true, minLength: 6, maxLength: 225 },
  { name: "id_tipo_identificacion", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "numero_identificacion", required: true, minLength: 6, maxLength: 100 },
  { name: "correo", required: true, minLength: 6, maxLength: 100 },
  { name: "telefono", required: true, minLength: 6, maxLength: 100 },
  { name: "direccion", required: true, minLength: 6, maxLength: 100 },
  { name: "id_ciudad", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "estado", required: true, minLength: 6, maxLength: 100 },
];
