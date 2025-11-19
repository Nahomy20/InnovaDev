<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'empleados_asistencias_db');

// Función p
// para conectar a la base de datos
function getConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            error_log("Error de conexión a la base de datos: " . $conn->connect_error);
            return null;
        }
        
        $conn->set_charset("utf8mb4");
        return $conn;
    } catch (Exception $e) {
        error_log("Error en getConnection: " . $e->getMessage());
        return null;
    }
}

// Función para cerrar la conexión
function closeConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}

// Configuración de sesión
if (session_status() === PHP_SESSION_NONE) {
    // Configurar parámetros de sesión
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_secure', 0); // 0 para desarrollo local, 1 para producción con HTTPS
    session_start();
}
?>




