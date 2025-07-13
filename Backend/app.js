import express from "express";
import dotenv from "dotenv"; // trabajar con el archivo de configuracion 
import cors from "cors";// para trabajar fuera del dominio
import bodyParser from "body-parser"; //parsear de lo que recibire en la informacion
import cookieParser from "cookie-parser"; // autenticacion para enviar una cookie

import authRoutes from "./src/routes/authRoutes.js";
import administradorRoutes from "./src/routes/administradorRoutes.js";
import clientesRoutes from "./src/routes/clientesRoutes.js";
import empleadosRoutes  from "./src/routes/empleadosRoutes.js";
import equiposRoutes  from "./src/routes/equiposRoutes.js";
import mantenimientosRoutes  from "./src/routes/mantenimientosRoutes.js";
import proveedoresRoutes  from "./src/routes/proveedoresRoutes.js";
import pagosRoutes  from "./src/routes/pagosRoutes.js";
import personasRoutes from "./src/routes/personasRoutes.js";
import usuariosRoutes from "./src/routes/usuariosRoutes.js";



dotenv.config();

// Crear la instancia de Express
const app = express();
// Middleware
// Habilita CORS
app.use(cors()); 
// Permite que la app acepte datos JSON
app.use(bodyParser.json()); 
// app.use(express.json());
// Permite el envio de datos de tipo utlencode
app.use(express.urlencoded({ extended: true }));
// Permite manejar cookies en las respuestas.
app.use(cookieParser());
// Rutas
app.use("/api/clientes", clientesRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/user", usuariosRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/admin", administradorRoutes);

// Puerto para ejecutar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});