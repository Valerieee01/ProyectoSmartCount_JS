#Creamos si no existe el usuario john_tecnico2055 lo restringimos a solo peticiones en forma local y le asignamos la contraseña #Aprendiz2025
CREATE USER IF NOT EXISTS "node_js"@"localhost" IDENTIFIED BY "Aprendiz2024";

#Creamos la base de datos
CREATE DATABASE node_sena CHARACTER SET utf8mb4;

#Asignamos la base de datos al usuario y le damos todos los permisos
GRANT ALL PRIVILEGES ON node_sena.* TO "node_js"@"localhost";

#Refrescamos los permisos de todo el sistema
FLUSH PRIVILEGES;

use node_sena;

-- Crear la tabla 'categorias'
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ID de la categoría (clave primaria)
  nombre VARCHAR(255) NOT NULL, -- Nombre de la categoría
  descripcion TEXT, -- Descripción opcional de la categoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Crear la tabla 'productos'
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY, -- ID del producto (clave primaria)
  nombre VARCHAR(255) NOT NULL, -- Nombre del producto
  descripcion TEXT, -- Descripción opcional del producto
  precio DECIMAL(10, 2), -- Precio del producto
  categoria_id INT, -- Clave foránea que referencia a la tabla 'categorias'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL -- Establece la relación y comportamiento al eliminar una categoría
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT
);


INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Categoría para productos electrónicos'),
('Ropa', 'Categoría para prendas de vestir'),
('Alimentos', 'Categoría para productos alimenticios');


INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES
('Smartphone', 'Teléfono inteligente con 64GB de almacenamiento', 499.99, 1),
('Laptop', 'Portátil con pantalla de 15 pulgadas', 799.99, 1),
('Camiseta', 'Camiseta de algodón para hombre', 19.99, 2),
('Manzanas', 'Manzanas frescas de calidad', 5.99, 3);

select * from categorias;
select * from productos;
select * from usuarios;

describe productos;
select * from categorias where id = 2;
select * from productos where  categoria_id = 2;


SELECT p.id, p.nombre AS producto, p.descripcion, p.precio, c.nombre AS categoria
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

SELECT c.id, c.nombre AS categoria, p.nombre AS producto
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id;
