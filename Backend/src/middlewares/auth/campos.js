export const campos = [
  {
    name: "nombreCompleto",
    required: true,
    minLength: 6,
    maxLength: 40
  },
  {
    name: "correo",
    required: true,
    minLength: 6,
    maxLength: 40,
    type: "email",
  },
  {
    name: "contrasena",
    required: true,
    minLength: 6,
    maxLength: 40
  },
];
