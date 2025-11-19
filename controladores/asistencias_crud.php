<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Inicie sesión.']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id_empleado = $_POST['id_empleado'] ?? '';
        $fecha = $_POST['fecha'] ?? date('Y-m-d');
        $hora_entrada = $_POST['hora_entrada'] ?? null;
        $hora_salida = $_POST['hora_salida'] ?? null;
        $estado = $_POST['estado'] ?? 'presente';
        
        $stmt = $conn->prepare("INSERT INTO asistencias (id_empleado, fecha, hora_entrada, hora_salida, estado) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $id_empleado, $fecha, $hora_entrada, $hora_salida, $estado);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Asistencia registrada correctamente', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar asistencia']);
        }
        $stmt->close();
        break;
        
    case 'read':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT a.*, e.nombre as empleado_nombre FROM asistencias a JOIN empleados e ON a.id_empleado = e.id WHERE a.id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $asistencia = $result->fetch_assoc();
            $stmt->close();
            echo json_encode(['success' => true, 'asistencia' => $asistencia]);
        } else {
            $search = $_GET['search'] ?? '';
            $query = "SELECT a.*, e.nombre as empleado_nombre FROM asistencias a JOIN empleados e ON a.id_empleado = e.id";
            if ($search) {
                $query .= " WHERE e.nombre LIKE ? OR a.fecha LIKE ? OR a.estado LIKE ?";
            }
            $query .= " ORDER BY a.fecha DESC";
            
            if ($search) {
                $searchTerm = "%$search%";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
            } else {
                $stmt = $conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $asistencias = [];
            while ($row = $result->fetch_assoc()) {
                $asistencias[] = $row;
            }
            $stmt->close();
            echo json_encode(['success' => true, 'asistencias' => $asistencias]);
        }
        break;
        
    case 'update':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id = $_POST['id'] ?? '';
        $id_empleado = $_POST['id_empleado'] ?? '';
        $fecha = $_POST['fecha'] ?? '';
        $hora_entrada = $_POST['hora_entrada'] ?? null;
        $hora_salida = $_POST['hora_salida'] ?? null;
        $estado = $_POST['estado'] ?? 'presente';
        
        $stmt = $conn->prepare("UPDATE asistencias SET id_empleado = ?, fecha = ?, hora_entrada = ?, hora_salida = ?, estado = ? WHERE id = ?");
        $stmt->bind_param("issssi", $id_empleado, $fecha, $hora_entrada, $hora_salida, $estado, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Asistencia actualizada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar asistencia']);
        }
        $stmt->close();
        break;
        
    case 'delete':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM asistencias WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Asistencia eliminada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar asistencia']);
        }
        $stmt->close();
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

closeConnection($conn);
?>




