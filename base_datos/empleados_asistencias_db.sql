-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2025 a las 04:56:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `empleados_asistencias_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `estado` enum('presente','tarde','ausente','permiso') DEFAULT 'presente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`id`, `id_empleado`, `fecha`, `hora_entrada`, `hora_salida`, `estado`) VALUES
(1, 1, '2025-11-10', '08:02:00', '16:05:00', 'ausente'),
(2, 2, '2025-11-10', '08:10:00', '16:02:00', 'tarde'),
(4, 4, '2025-11-18', '11:48:00', '13:47:00', 'presente'),
(5, 2, '2025-11-18', '11:17:00', '12:16:00', 'presente'),
(6, 5, '2025-11-18', '15:20:00', '16:22:00', 'presente'),
(7, 3, '2025-11-18', '12:36:00', '13:36:00', 'presente'),
(8, 5, '2025-11-18', '14:21:00', '15:20:00', 'presente'),
(10, 5, '2025-11-18', '13:35:00', '14:34:00', 'ausente'),
(11, 8, '2025-11-19', '18:32:00', '21:32:00', 'presente'),
(12, 6, '2025-11-19', '20:32:00', '20:32:00', 'presente'),
(13, 5, '2025-11-19', '18:33:00', '21:32:00', 'presente'),
(14, 4, '2025-11-19', '18:33:00', '21:33:00', 'presente'),
(15, 3, '2025-11-19', '20:33:00', '23:33:00', 'presente'),
(16, 2, '2025-11-19', '18:33:00', '21:33:00', 'presente'),
(17, 1, '2025-11-19', '19:33:00', '22:33:00', 'presente'),
(18, 4, '2025-11-19', '21:36:00', '23:35:00', 'presente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombre`, `cargo`, `area`, `estado`) VALUES
(1, 'Oscar Gonzalez', 'Supervisor', 'Producción', 'activo'),
(2, 'Nahomy Guevara', 'Asistente', 'Recursos Humanos', 'activo'),
(3, 'xander Bermudez', 'base de datos', 'tecnologia', 'activo'),
(4, 'Chayo Murillo', 'presidenta', 'Proteccion', 'activo'),
(5, 'Maria Castellon', 'diseño grafico', 'publicidad', 'activo'),
(6, 'Lenia Fonseca', 'desarollo de software', 'redes', 'inactivo'),
(8, 'Anthony Fonseca', 'educacion', 'humanidades', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id`, `id_empleado`, `hora_entrada`, `hora_salida`) VALUES
(1, 1, '08:00:00', '16:00:00'),
(2, 2, '08:00:00', '16:00:00'),
(12, 5, '13:45:00', '17:44:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `tipo_permiso` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('aprobado','pendiente','rechazado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `id_empleado`, `tipo_permiso`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(7, 2, 'Médico', '2025-11-18', '2025-11-19', 'pendiente'),
(10, 3, 'Médico', '2025-11-18', '2025-11-20', 'aprobado'),
(11, 4, 'Personal', '2025-11-18', '2025-11-19', 'rechazado'),
(13, 5, 'Médico', '2025-11-17', '2025-11-19', 'aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','empleado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `id_empleado`, `usuario`, `contraseña`, `rol`) VALUES
(1, 1, 'oscar', 'osc4r23', 'admin'),
(2, 2, 'nahomy', 'naho2025', 'empleado'),
(3, 5, 'maria', 'mary123', 'empleado'),
(4, 3, 'xander', 'xander123', 'empleado'),
(5, 4, 'chayo', '12345', 'empleado'),
(9, 8, 'anthony', 'anthony123', 'empleado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `id_empleado` (`id_empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`);

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`);

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
