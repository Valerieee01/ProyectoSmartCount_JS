export const campos = [
  { name: "id_usuario", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "nombreCompleto", required: true, minLength: 6, maxLength: 225 },
  { name: "correo", required: true, minLength: 6, maxLength: 100 },
  { name: "contrasena", required: true, type: "date", minLength: 6, maxLength: 100 },
  { name: "id_rol", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "estado", required: true, minLength: 6, maxLength: 225 }
];
