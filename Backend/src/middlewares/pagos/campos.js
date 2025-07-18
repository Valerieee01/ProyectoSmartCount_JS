export const campos = [
  { name: "id_cliente", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "id_mantenimiento", required: true, type: "number", minLength: 1, maxLength: 11 },
  { name: "detalle", required: true, minLength: 6, maxLength: 100 },
  { name: "valor_trabajo", required: true, type: "number", minLength: 1,  },
  { name: "valor_pagado", required: true, type: "number", minLength: 1,  },
  { name: "estado_pago", required: true, minLength: 6, maxLength: 100 },
  { name: "fecha_facturacion", required: true, type: "number" ,type: "number", minLength: 6, maxLength: 100 },
  { name: "dias_plazo", required: true, minLength: 1, maxLength: 100 }
];
