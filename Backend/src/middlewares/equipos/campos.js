export const campos = [
  { name: "numero_equipo", required: true, type: "number", minLength: 1, maxLength: 100 },
  { name: "placa", required: true, minLength: 6, maxLength: 225 },
  { name: "fecha_mantenimiento", required: true, type: "date", minLength: 6, maxLength: 255 },
  { name: "descripcion", required: true, minLength: 6, maxLength: 100 },
  { name: "id_cliente", required: true, type: "number", minLength: 1, maxLength: 11 },
];
