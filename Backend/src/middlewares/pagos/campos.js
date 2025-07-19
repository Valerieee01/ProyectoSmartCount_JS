
export const campos = [
    { name: "id_cliente", required: true, type: "number" }, 
    { name: "id_mantenimiento", required: true, type: "number" }, 
    { name: "detalle", required: false, type: "string", minLength: 6, maxLength: 500 }, 
    { name: "valor_trabajo", required: true, type: "number" }, 
    { name: "valor_pagado", required: true, type: "number" }, 
    { name: "estado_pago", required: true, type: "string" }, 
    { name: "fecha_facturacion", required: true, type: "string" }, 
    { name: "dias_plazo", required: true, type: "number" } 
];