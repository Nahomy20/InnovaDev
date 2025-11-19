-- Backup de Base de Datos
-- Fecha: 2025-11-19 01:54:01

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


-- Estructura de tabla `asistencias`
DROP TABLE IF EXISTS `asistencias`;
CREATE TABLE `asistencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `estado` enum('presente','tarde','ausente','permiso') DEFAULT 'presente',
  PRIMARY KEY (`id`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `asistencias`
INSERT INTO `asistencias` VALUES
('1','1','2025-11-10','08:02:00','16:05:00','ausente'),
('2','2','2025-11-10','08:10:00','16:02:00','tarde'),
('4','4','2025-11-18','11:48:00','13:47:00','presente'),
('5','2','2025-11-18','11:17:00','12:16:00','presente'),
('6','5','2025-11-18','15:20:00','16:22:00','presente'),
('7','3','2025-11-18','12:36:00','13:36:00','presente'),
('8','5','2025-11-18','14:21:00','15:20:00','presente'),
('10','5','2025-11-18','13:35:00','14:34:00','ausente'),
('11','8','2025-11-19','18:32:00','21:32:00','presente'),
('12','6','2025-11-19','20:32:00','20:32:00','presente'),
('13','5','2025-11-19','18:33:00','21:32:00','presente'),
('14','4','2025-11-19','18:33:00','21:33:00','presente'),
('15','3','2025-11-19','20:33:00','23:33:00','presente'),
('16','2','2025-11-19','18:33:00','21:33:00','presente'),
('17','1','2025-11-19','19:33:00','22:33:00','presente');


-- Estructura de tabla `empleados`
DROP TABLE IF EXISTS `empleados`;
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `empleados`
INSERT INTO `empleados` VALUES
('1','Oscar Gonzalez','Supervisor','Producción','activo'),
('2','Nahomy Guevara','Asistente','Recursos Humanos','activo'),
('3','xander Bermudez','base de datos','tecnologia','activo'),
('4','Chayo Murillo','presidenta','Proteccion','activo'),
('5','Maria Castellon','diseño grafico','publicidad','activo'),
('6','Lenia Fonseca','desarollo de software','redes','inactivo'),
('8','Anthony Fonseca','educacion','humanidades','activo');


-- Estructura de tabla `horarios`
DROP TABLE IF EXISTS `horarios`;
CREATE TABLE `horarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `horarios`
INSERT INTO `horarios` VALUES
('1','1','08:00:00','16:00:00'),
('2','2','08:00:00','16:00:00'),
('12','5','13:45:00','17:44:00');


-- Estructura de tabla `permisos`
DROP TABLE IF EXISTS `permisos`;
CREATE TABLE `permisos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `tipo_permiso` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('aprobado','pendiente','rechazado') DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `permisos`
INSERT INTO `permisos` VALUES
('7','2','Médico','2025-11-18','2025-11-19','pendiente'),
('10','3','Médico','2025-11-18','2025-11-20','aprobado'),
('11','4','Personal','2025-11-18','2025-11-19','rechazado');


-- Estructura de tabla `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','empleado') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `fk_usuario_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `usuarios`
INSERT INTO `usuarios` VALUES
('1','1','oscar','osc4r23','admin'),
('2','2','nahomy','naho2025','empleado'),
('3','5','maria','mary123','empleado'),
('4','3','xander','xander123','empleado'),
('5','4','chayo','12345','empleado'),
('9','8','anthony','anthony123','empleado');

