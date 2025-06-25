export const campos = [
  
  { name: "id_equipo", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "descripcion_trabajo", required: true, minLength: 6, maxLength: 225 },
  { name: "id_empleado", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "tipo_mantenimiento", required: true, minLength: 6, maxLength: 100 },
  { name: "fecha_mantenimiento", required: true, type: "date", minLength: 6, maxLength: 100 },
  { name: "observaciones", required: true, minLength: 6, maxLength: 225 }

];
