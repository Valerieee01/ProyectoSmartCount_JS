#Crear un usuario DBA
create user if not exists usuario_fixmasterAcces@localhost identified by "FixmasterP1";

#Creamos la base de datos 
create database Fixmaster_P1_DBA;

#Asignar permisos al usuario 
grant all privileges on Fixmaster_P1_DBA .* to usuario_fixmasterAcces@localhost;
flush privileges;

#----------------------------------------------------------------------------------
#Crear un usuario Admin
create user if not exists usuario_fixmasterADMIN@localhost identified by "admin";

#Asignar permisos al usuario 
grant all privileges on Fixmaster_P1_DBA .* to usuario_fixmasterADMIN@localhost;

#----------------------------------------------------------------------------------

#Crear un usuario Admin
create user if not exists usuario_fixmasterEMPLOY@localhost identified by "employ";

#---DROP USER usuario_SmartCountEMPLOY@localhost;

#Asignar permisos al usuario 
grant all privileges on Fixmaster_P1_DBA .* to usuario_fixmasterEMPLOY@localhost;


**********************************************************************************************************************************

USE Fixmaster_P1_DBA;

-- Tabla de tipos de identificación
CREATE TABLE tipos_identificacion (
    id_tipo_identificacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('CC', 'TI', 'CE', 'PAS') NOT NULL UNIQUE
);

-- Tabla de ciudades
CREATE TABLE ciudades (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL UNIQUE,
    departamento VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia'
);

-- Tabla de roles
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombreCompleto VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Tabla de personas (base para clientes, proveedores y empleados)
CREATE TABLE personas (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo_razon_social VARCHAR(250) NOT NULL,
    id_tipo_identificacion INT NOT NULL,
    numero_identificacion VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    id_ciudad INT NOT NULL, -- Corregido: Uso de FK desde el inicio
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_identificacion) REFERENCES tipos_identificacion(id_tipo_identificacion) ON DELETE CASCADE,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad) ON DELETE CASCADE
);

-- Clientes
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY,
    FOREIGN KEY (id_cliente) REFERENCES personas(id_persona) ON DELETE CASCADE
);

-- Proveedores
CREATE TABLE proveedores (
    id_proveedor INT PRIMARY KEY,
    FOREIGN KEY (id_proveedor) REFERENCES personas(id_persona) ON DELETE CASCADE
);

-- Empleados
CREATE TABLE empleados (
    id_empleado INT PRIMARY KEY,
    FOREIGN KEY (id_empleado) REFERENCES personas(id_persona) ON DELETE CASCADE
);

-- Equipos
CREATE TABLE equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    numero_equipo VARCHAR(50) NOT NULL UNIQUE,
    placa VARCHAR(50),
    descripcion TEXT,
    id_cliente INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- Mantenimientos
CREATE TABLE mantenimientos (
    id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT NOT NULL,
    descripcion_trabajo TEXT,
    id_empleado INT, -- Ahora es una FK directa
    tipo_mantenimiento ENUM('preventivo', 'correctivo') NOT NULL,
    fecha_mantenimiento DATE,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE
);

-- Empleados asignados a mantenimientos (muchos a muchos)
CREATE TABLE empleados_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    id_mantenimiento INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE,
    FOREIGN KEY (id_mantenimiento) REFERENCES mantenimientos(id_mantenimiento) ON DELETE CASCADE
);

-- Pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_mantenimiento INT NOT NULL,
    detalle TEXT,
    valor_trabajo DECIMAL(10,2) NOT NULL,
    valor_pagado DECIMAL(10,2) DEFAULT 0.00,
    valor_mora DECIMAL(10,2) GENERATED ALWAYS AS (valor_trabajo - IFNULL(valor_pagado, 0)) STORED,
    estado_pago ENUM('pendiente', 'pagado', 'vencido') NOT NULL DEFAULT 'pendiente', 
    fecha_facturacion DATE,
    dias_plazo INT,
    fecha_vencimiento DATE GENERATED ALWAYS AS (
        DATE_ADD(fecha_facturacion, INTERVAL dias_plazo DAY)
    ) STORED,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_mantenimiento) REFERENCES mantenimientos(id_mantenimiento) ON DELETE CASCADE
);



--
-- Datos para la tabla 'tipos_identificacion'
--
INSERT INTO tipos_identificacion (tipo) VALUES
('CC'),
('TI'),
('CE'),
('PAS');

--
-- Datos para la tabla 'ciudades'
--
INSERT INTO ciudades (nombre_ciudad, departamento, pais) VALUES
('Bogotá D.C.', 'Cundinamarca', 'Colombia'),
('Medellín', 'Antioquia', 'Colombia'),
('Cali', 'Valle del Cauca', 'Colombia'),
('Bucaramanga', 'Santander', 'Colombia'),
('Barranquilla', 'Atlántico', 'Colombia'),
('Cartagena', 'Bolívar', 'Colombia'),
('Cúcuta', 'Norte de Santander', 'Colombia'),
('Pereira', 'Risaralda', 'Colombia'),
('Manizales', 'Caldas', 'Colombia'),
('Villavicencio', 'Meta', 'Colombia'),
('Santa Marta', 'Magdalena', 'Colombia'),
('Pasto', 'Nariño', 'Colombia'),
('Armenia', 'Quindío', 'Colombia'),
('Ibagué', 'Tolima', 'Colombia'),
('Neiva', 'Huila', 'Colombia'),
('Popayán', 'Cauca', 'Colombia'),
('Riohacha', 'La Guajira', 'Colombia'),
('Tunja', 'Boyacá', 'Colombia'),
('Florencia', 'Caquetá', 'Colombia'),
('Quibdó', 'Chocó', 'Colombia');

--
-- Datos para la tabla 'roles'
--
INSERT INTO roles (nombre_rol) VALUES
('Administrador'), -- ID 1
('Empleado');      -- ID 2

--
-- Datos para la tabla 'personas' (base para clientes, proveedores y empleados)
--
INSERT INTO personas (nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, direccion, id_ciudad, estado) VALUES
-- Clientes
('Juan Pérez Gómez', 1, '1012345678', 'juan.perez@example.com', '3001234567', 'Calle 10 # 5-15', 1, 'activo'),
('Maria López Cía. S.A.S.', 3, '900123456-1', 'maria.lopez@empresa.com', '6012345678', 'Avenida siempre viva 123', 2, 'activo'),
('Ana María Restrepo', 1, '1001001001', 'ana.restrepo@example.com', '3011234500', 'Calle 50 # 15-20', 1, 'activo'),
('Pedro Sánchez', 1, '1001001002', 'pedro.sanchez@example.com', '3022345601', 'Carrera 8 # 25-30', 2, 'activo'),
('Sofía Vargas', 1, '1001001003', 'sofia.vargas@example.com', '3033456702', 'Avenida 40 # 10-10', 3, 'activo'),
('Constructora Sol S.A.S.', 3, '900000001-1', 'contact@constructorasol.com', '6044567803', 'Diagonal 60 # 5-50', 4, 'activo'),
('Transportes Rápidos Ltda.', 3, '900000002-2', 'info@transportesrapidos.com', '6055678904', 'Via 100 # 20-30', 5, 'activo'),
('Luisa Fernanda Giraldo', 1, '1001001004', 'luisa.giraldo@example.com', '3019876543', 'Calle 22 # 11-22', 6, 'activo'),
('Roberto Carlos Días', 1, '1001001005', 'roberto.diaz@example.com', '3005544332', 'Carrera 15 # 33-44', 7, 'activo'),
('Inversiones Alfa S.A.', 3, '900000003-3', 'gerencia@alfainversiones.com', '6078899001', 'Avenida 80 # 7-77', 8, 'activo'),
('Andrea Carolina Pardo', 1, '1001001006', 'andrea.pardo@example.com', '3041234567', 'Calle 100 # 50-50', 9, 'activo'),
('Fábrica del Futuro S.A.S.', 3, '900000004-4', 'ventas@fabricafuturo.com', '6089900112', 'Zona Industrial Km 5', 10, 'activo'),

-- Proveedores
('Proveedora Repuestos S.A.', 3, '800987654-2', 'ventas@repuestos.com', '3109876543', 'Carrera 20 # 30-40', 3, 'activo'),
('Distribuciones Herramientas Ltda.', 3, '700111222-3', 'info@herramientas.com', '3205556677', 'Diagonal 50 # 10-20', 1, 'activo'),
('Suministros Industriales S.A.', 3, '800000001-1', 'ventas@suministrosind.com', '6011122334', 'Calle 70 # 10-10', 1, 'activo'),
('Ferretería El Tornillo', 3, '800000002-2', 'contacto@eltornillo.com', '6022233445', 'Carrera 30 # 10-20', 2, 'activo'),
('Lubricantes Premium Ltda.', 3, '800000003-3', 'pedidos@lubricantesprem.com', '6033344556', 'Autopista Sur Km 1', 3, 'activo'),
('Herramientas de Precisión S.A.S.', 3, '800000004-4', 'info@herrprecision.com', '6044455667', 'Via Principal # 1-10', 4, 'activo'),
('Electrónica Avanzada Cía.', 3, '800000005-5', 'soporte@electronicaav.com', '6055566778', 'Parque Industrial Local 5', 5, 'activo'),

-- Empleados
('Carlos Restrepo Zapata', 1, '1020304050', 'carlos.restrepo@fixmaster.com', '3112233445', 'Calle 30 # 45-60', 4, 'activo'),
('Laura García Diaz', 1, '1030405060', 'laura.garcia@fixmaster.com', '3156677889', 'Carrera 70 # 80-90', 1, 'activo'),
('Diego Torres Moreno', 1, '1040506070', 'diego.torres@fixmaster.com', '3009988776', 'Avenida 45 # 5-50', 2, 'activo'),
('Miguel Ángel Rodríguez', 1, '1001001007', 'miguel.rodriguez@fixmaster.com', '3123456789', 'Calle 80 # 20-30', 1, 'activo'),
('Valentina Osorio Vargas', 1, '1001001008', 'valentina.osorio@fixmaster.com', '3134567890', 'Carrera 40 # 5-10', 2, 'activo'),
('Andrés Felipe Rojas', 1, '1001001009', 'andres.rojas@fixmaster.com', '3145678901', 'Diagonal 90 # 10-10', 3, 'activo'),
('Camila Alejandra Soto', 1, '1001001010', 'camila.soto@fixmaster.com', '3156789012', 'Calle 60 # 12-34', 4, 'activo'),
('Fernando David Ríos', 1, '1001001011', 'fernando.rios@fixmaster.com', '3167890123', 'Avenida 10 # 5-5', 5, 'activo');

--
-- Datos para la tabla 'usuarios'
--
INSERT INTO usuarios (nombreCompleto, correo, contrasena, id_rol, estado) VALUES
('Admin Principal', 'admin@fixmaster.com', 'hashed_password_admin_1', 1, 'activo'),
('Laura García Diaz', 'laura.garcia@fixmaster.com', 'hashed_password_laura', 1, 'activo'), 
('Carlos Restrepo Zapata', 'carlos.restrepo@fixmaster.com', 'hashed_password_carlos', 2, 'activo'),
('Diego Torres Moreno', 'diego.torres@fixmaster.com', 'hashed_password_diego', 2, 'activo'),
('Miguel Ángel Rodríguez', 'miguel.rodriguez@fixmaster.com', 'hashed_password_miguel', 2, 'activo'),
('Andrés Felipe Rojas', 'andres.rojas@fixmaster.com', 'hashed_password_andres', 2, 'activo'),
('Fernando David Ríos', 'fernando.rios@fixmaster.com', 'hashed_password_fernando', 2, 'activo'),
('Valentina Osorio Vargas', 'valentina.osorio@fixmaster.com', 'hashed_password_valentina', 2, 'activo');


--
-- Datos para la tabla 'clientes'
--
INSERT INTO clientes (id_cliente) VALUES
(1), (2), (8), (9), (10), (11), (12), (13), (14), (15), (16), (17);

--
-- Datos para la tabla 'proveedores'
--
INSERT INTO proveedores (id_proveedor) VALUES
(3), (4), (18), (19), (20), (21), (22);

--
-- Datos para la tabla 'empleados'
--
INSERT INTO empleados (id_empleado) VALUES
(5), (6), (7), (23), (24), (25), (26), (27);

--
-- Datos para la tabla 'equipos'
--
INSERT INTO equipos (numero_equipo, placa, descripcion, id_cliente) VALUES
('EQ001', 'ABC123', 'Vehículo: Camioneta Ford F-150', 1),
('EQ002', 'DEF456', 'Maquinaria: Excavadora Caterpillar', 2),
('EQ003', 'GHI789', 'Vehículo: Moto Honda CBR 600', 1),
('EQ004', 'JKL012', 'Vehículo: Camión Hino FG', 8),
('EQ005', 'MNO345', 'Maquinaria: Montacargas Toyota', 9),
('EQ006', 'PQR678', 'Vehículo: Automóvil Mazda 3', 10),
('EQ007', 'STU901', 'Maquinaria: Retroexcavadora John Deere', 11),
('EQ008', 'VWX234', 'Vehículo: Buseta Chevrolet', 12),
('EQ009', 'YZA567', 'Vehículo: Tractomula International', 13),
('EQ010', 'BCD890', 'Maquinaria: Generador Eléctrico Perkins', 14),
('EQ011', 'EFG123', 'Vehículo: Van Mercedes-Benz Sprinter', 15),
('EQ012', 'HIJ456', 'Maquinaria: Compresor de Aire Atlas Copco', 16),
('EQ013', 'KLM789', 'Vehículo: Moto Yamaha FZ', 17),
('EQ014', 'NOP012', 'Vehículo: Camioneta Nissan Frontier', 1),
('EQ015', 'QRS345', 'Maquinaria: Taladro Industrial Bosch', 2);


--
-- Datos para la tabla 'mantenimientos'
--
INSERT INTO mantenimientos (id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones) VALUES
(1, 'Cambio de aceite y filtro', 5, 'preventivo', '2024-06-20', 'Se usó aceite sintético.'),
(2, 'Reparación de sistema hidráulico', 7, 'correctivo', '2024-06-22', 'Se reemplazó la bomba hidráulica.'),
(1, 'Revisión de frenos', 5, 'preventivo', '2024-06-25', 'Pastillas delanteras al 50%.'),
(3, 'Reemplazo de llanta trasera', 7, 'correctivo', '2024-06-23', 'Llanta pinchada, se instaló nueva.'),
(4, 'Revisión general y cambio de filtros de aire', 23, 'preventivo', '2024-06-25', 'Se recomienda cambio de pastillas en 3 meses.'),
(5, 'Reparación de cilindro hidráulico', 25, 'correctivo', '2024-06-26', 'Pieza de repuesto solicitada al proveedor.'),
(6, 'Alineación y balanceo', 23, 'preventivo', '2024-06-27', 'Neumáticos en buen estado.'),
(7, 'Diagnóstico de falla eléctrica', 25, 'correctivo', '2024-06-28', 'Corto circuito en cableado principal.'),
(8, 'Cambio de aceite y filtro de combustible', 5, 'preventivo', '2024-06-29', 'Rutina de mantenimiento programada.'),
(9, 'Revisión y ajuste de frenos de remolque', 7, 'preventivo', '2024-06-30', 'Frenos ligeramente desgastados.'),
(10, 'Reemplazo de batería y diagnóstico de carga', 23, 'correctivo', '2024-07-01', 'Batería defectuosa, instalada nueva.'),
(11, 'Inspección de sistema de refrigeración', 25, 'preventivo', '2024-07-02', 'Nivel de refrigerante bajo, rellenado.'),
(12, 'Mantenimiento del motor y limpieza de inyectores', 5, 'preventivo', '2024-07-03', 'Motor funcionando suave.'),
(13, 'Reparación de sistema de dirección asistida', 7, 'correctivo', '2024-07-04', 'Fuga en manguera, reemplazada.'),
(14, 'Servicio de 50,000 km', 23, 'preventivo', '2024-07-05', 'Revisión completa de componentes.'),
(15, 'Mantenimiento de caja de cambios', 25, 'preventivo', '2024-07-06', 'Cambio de fluido y filtro de transmisión.'),
(4, 'Inspección de luces y señalización', 5, 'preventivo', '2024-07-07', 'Bombillo delantero derecho quemado, reemplazado.'),
(5, 'Calibración de inyectores', 7, 'correctivo', '2024-07-08', 'Ajuste de la presión de inyección.'),
(6, 'Revisión de suspensión', 23, 'preventivo', '2024-07-09', 'Amortiguadores en buen estado.'),
(7, 'Reemplazo de motor de arranque', 25, 'correctivo', '2024-07-10', 'El motor no encendía.'),
(8, 'Chequeo de niveles y fluidos', 5, 'preventivo', '2024-07-11', 'Todos los niveles correctos.'),
(9, 'Inspección de sistema de escape', 7, 'preventivo', '2024-07-12', 'Pequeña fuga en el silenciador, sellada.'),
(10, 'Reparación de sistema de frenos ABS', 23, 'correctivo', '2024-07-13', 'Sensor ABS defectuoso, reemplazado.'),
(11, 'Revisión de sistema eléctrico', 25, 'preventivo', '2024-07-14', 'Cableado en orden.'),
(12, 'Cambio de correas de motor', 5, 'preventivo', '2024-07-15', 'Correas desgastadas, reemplazadas por nuevas.'),
(13, 'Diagnóstico de ruido en motor', 7, 'correctivo', '2024-07-16', 'Problema en rodamiento, corregido.'),
(14, 'Inspección de sistema de embrague', 23, 'preventivo', '2024-07-17', 'Embrague funcionando correctamente.'),
(15, 'Mantenimiento de sistema de dirección', 25, 'preventivo', '2024-07-18', 'Ajuste de la caja de dirección.');


--
-- Datos para la tabla 'empleados_mantenimiento'
--
INSERT INTO empleados_mantenimiento (id_empleado, id_mantenimiento) VALUES
(5, 1), (7, 2), (5, 3), (7, 4),
(23, 5), (25, 6), (23, 7), (25, 8),
(5, 9), (7, 10), (23, 11), (25, 12),
(5, 13), (7, 14), (23, 15), (25, 16),
(5, 17), (7, 18), (23, 19), (25, 20),
(5, 21), (7, 22), (23, 23), (25, 24),
(5, 25), (7, 26);


--
-- Datos para la tabla 'pagos'
--
INSERT INTO pagos (id_cliente, id_mantenimiento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo) VALUES
(1, 1, 'Mantenimiento preventivo camioneta', 150.00, 150.00, 'pagado', '2024-06-20', 15),
(2, 2, 'Reparación excavadora', 850.50, 0.00, 'pendiente', '2024-06-22', 30),
(1, 3, 'Revisión de frenos Ford F-150', 80.00, 50.00, 'pendiente', '2024-06-25', 7),
(1, 4, 'Cambio de llanta moto', 200.00, 0.00, 'pendiente', '2024-06-23', 10),
(8, 5, 'Mantenimiento preventivo camión Hino', 250.00, 250.00, 'pagado', '2024-06-25', 10),
(9, 6, 'Reparación montacargas', 1200.00, 0.00, 'pendiente', '2024-06-26', 30),
(10, 7, 'Alineación y balanceo Mazda 3', 75.00, 75.00, 'pagado', '2024-06-27', 7),
(11, 8, 'Diagnóstico de retroexcavadora', 300.00, 150.00, 'pendiente', '2024-06-28', 15),
(12, 9, 'Cambio de aceite buseta', 180.00, 180.00, 'pagado', '2024-06-29', 5),
(13, 10, 'Ajuste de frenos tractomula', 90.00, 0.00, 'pendiente', '2024-06-30', 20),
(14, 11, 'Reemplazo de batería generador', 450.00, 450.00, 'pagado', '2024-07-01', 10),
(15, 12, 'Inspección van Sprinter', 100.00, 0.00, 'pendiente', '2024-07-02', 15),
(16, 13, 'Mantenimiento compresor', 550.00, 500.00, 'pendiente', '2024-07-03', 30),
(17, 14, 'Reparación dirección moto Yamaha', 280.00, 0.00, 'pendiente', '2024-07-04', 10),
(8, 15, 'Servicio 50,000 km Hino', 600.00, 600.00, 'pagado', '2024-07-05', 7),
(9, 16, 'Mantenimiento caja de cambios', 700.00, 0.00, 'pendiente', '2024-07-06', 20),
(10, 17, 'Inspección luces Mazda 3', 45.00, 0.00, 'pendiente', '2024-07-07', 5),
(11, 18, 'Calibración inyectores retroexcavadora', 350.00, 350.00, 'pagado', '2024-07-08', 15),
(12, 19, 'Revisión suspensión buseta', 120.00, 0.00, 'pendiente', '2024-07-09', 10),
(13, 20, 'Reemplazo motor arranque', 500.00, 500.00, 'pagado', '2024-07-10', 7),
(14, 21, 'Chequeo niveles generador', 60.00, 0.00, 'pendiente', '2024-07-11', 15),
(15, 22, 'Inspección escape van Sprinter', 95.00, 0.00, 'pendiente', '2024-07-12', 30),
(16, 23, 'Reparación frenos ABS compresor', 420.00, 420.00, 'pagado', '2024-07-13', 10),
(17, 24, 'Revisión eléctrica moto Yamaha', 110.00, 0.00, 'pendiente', '2024-07-14', 5),
(1, 25, 'Cambio correas camioneta', 190.00, 0.00, 'pendiente', '2024-07-15', 20),
(2, 26, 'Diagnóstico ruido taladro', 220.00, 0.00, 'pendiente', '2024-07-16', 30);

