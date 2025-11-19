<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Inicie sesión.']);
    exit;
}

if ($_SESSION['rol'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'backup':
        $backup_dir = '../base_datos/backups/';
        if (!is_dir($backup_dir)) {
            mkdir($backup_dir, 0777, true);
        }
        
        $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $backup_dir . $filename;
        
        $conn = getConnection();
        
        // Obtener todas las tablas
        $tables = [];
        $result = $conn->query("SHOW TABLES");
        while ($row = $result->fetch_array()) {
            $tables[] = $row[0];
        }
        
        $output = "-- Backup de Base de Datos\n";
        $output .= "-- Fecha: " . date('Y-m-d H:i:s') . "\n\n";
        $output .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
        $output .= "SET time_zone = \"+00:00\";\n\n";
        
        foreach ($tables as $table) {
            // Estructura de la tabla
            $result = $conn->query("SHOW CREATE TABLE `$table`");
            $row = $result->fetch_array();
            $output .= "\n-- Estructura de tabla `$table`\n";
            $output .= "DROP TABLE IF EXISTS `$table`;\n";
            $output .= $row[1] . ";\n\n";
            
            // Datos de la tabla
            $result = $conn->query("SELECT * FROM `$table`");
            if ($result->num_rows > 0) {
                $output .= "-- Volcado de datos para la tabla `$table`\n";
                $output .= "INSERT INTO `$table` VALUES\n";
                
                $rows = [];
                while ($row = $result->fetch_assoc()) {
                    $values = [];
                    foreach ($row as $value) {
                        $values[] = $conn->real_escape_string($value);
                    }
                    $rows[] = "(" . implode(",", array_map(function($v) { return "'$v'"; }, $values)) . ")";
                }
                $output .= implode(",\n", $rows) . ";\n\n";
            }
        }
        
        file_put_contents($filepath, $output);
        closeConnection($conn);
        
        echo json_encode([
            'success' => true,
            'message' => 'Respaldo creado correctamente',
            'filename' => $filename,
            'filepath' => $filepath
        ]);
        break;
        
    case 'restore':
        $filename = $_POST['filename'] ?? '';
        if (empty($filename)) {
            echo json_encode(['success' => false, 'message' => 'Nombre de archivo requerido']);
            exit;
        }
        
        $filepath = '../base_datos/backups/' . $filename;
        if (!file_exists($filepath)) {
            echo json_encode(['success' => false, 'message' => 'Archivo de respaldo no encontrado']);
            exit;
        }
        
        $conn = getConnection();
        
        if (!$conn) {
            echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
            exit;
        }
        
        // Leer el archivo SQL
        $sql = file_get_contents($filepath);
        
        if ($sql === false) {
            closeConnection($conn);
            echo json_encode(['success' => false, 'message' => 'Error al leer el archivo de respaldo']);
            exit;
        }
        
        // Desactivar verificación de claves foráneas temporalmente
        $conn->query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Ejecutar las consultas
        $queries = explode(';', $sql);
        $success = true;
        $errors = [];
        
        foreach ($queries as $query) {
            $query = trim($query);
            // Ignorar comentarios y líneas vacías
            if (!empty($query) && !preg_match('/^--/', $query) && !preg_match('/^SET/', $query)) {
                if (!$conn->query($query)) {
                    // Ignorar errores de "table doesn't exist" en DROP TABLE
                    if (strpos($conn->error, "doesn't exist") === false) {
                        $success = false;
                        $errors[] = $conn->error;
                    }
                }
            }
        }
        
        // Reactivar verificación de claves foráneas
        $conn->query('SET FOREIGN_KEY_CHECKS = 1');
        
        closeConnection($conn);
        
        if ($success || count($errors) === 0) {
            echo json_encode(['success' => true, 'message' => 'Base de datos restaurada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al restaurar: ' . implode(', ', array_slice($errors, 0, 5))]);
        }
        break;
        
    case 'list':
        $backup_dir = '../base_datos/backups/';
        $files = [];
        
        if (is_dir($backup_dir)) {
            $dir_files = scandir($backup_dir);
            foreach ($dir_files as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                    $files[] = [
                        'filename' => $file,
                        'size' => filesize($backup_dir . $file),
                        'date' => date('Y-m-d H:i:s', filemtime($backup_dir . $file))
                    ];
                }
            }
        }
        
        // Ordenar por fecha (más reciente primero)
        usort($files, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        echo json_encode(['success' => true, 'backups' => $files]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>




