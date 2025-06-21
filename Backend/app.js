import express from "express";
// import multer from "multer";
import dotenv from "dotenv"; // trabajar con el archivo de configuracion 
import cors from "cors";// para trabajar fuera del dominio
import bodyParser from "body-parser"; //parsear de lo que recibire en la informacion
import cookieParser from "cookie-parser"; // autenticacion para enviar una cookie
import productoRoutes from "./src/routes/productosRoutes.js";
import categoriasRoutes from "./src/routes/categoriasRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import administradorRoutes from "./src/routes/administradorRoutes.js";

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
app.use('/api/productos', productoRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", administradorRoutes);

// Puerto para ejecutar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});