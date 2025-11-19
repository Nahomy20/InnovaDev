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
        $hora_entrada = $_POST['hora_entrada'] ?? '';
        $hora_salida = $_POST['hora_salida'] ?? '';
        
        // Validar campos requeridos
        if (empty($id_empleado)) {
            echo json_encode(['success' => false, 'message' => 'Debe seleccionar un empleado']);
            break;
        }
        
        if (empty($hora_entrada) || empty($hora_salida)) {
            echo json_encode(['success' => false, 'message' => 'Las horas de entrada y salida son requeridas']);
            break;
        }
        
        // Verificar si ya existe un horario para este empleado
        $check = $conn->prepare("SELECT id FROM horarios WHERE id_empleado = ?");
        if (!$check) {
            echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
            break;
        }
        
        $check->bind_param("i", $id_empleado);
        if (!$check->execute()) {
            $check->close();
            echo json_encode(['success' => false, 'message' => 'Error al verificar horario existente: ' . $check->error]);
            break;
        }
        
        $result = $check->get_result();
        
        if ($result->num_rows > 0) {
            $check->close();
            echo json_encode(['success' => false, 'message' => 'Este empleado ya tiene un horario asignado. Use actualizar.']);
            break;
        }
        $check->close();
        
        $stmt = $conn->prepare("INSERT INTO horarios (id_empleado, hora_entrada, hora_salida) VALUES (?, ?, ?)");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
            break;
        }
        
        $stmt->bind_param("iss", $id_empleado, $hora_entrada, $hora_salida);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Horario registrado correctamente', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar horario: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'read':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT h.*, e.nombre as empleado_nombre FROM horarios h JOIN empleados e ON h.id_empleado = e.id WHERE h.id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $horario = $result->fetch_assoc();
            $stmt->close();
            echo json_encode(['success' => true, 'horario' => $horario]);
        } else {
            $search = $_GET['search'] ?? '';
            $query = "SELECT h.*, e.nombre as empleado_nombre FROM horarios h JOIN empleados e ON h.id_empleado = e.id";
            if ($search) {
                $query .= " WHERE e.nombre LIKE ? OR h.hora_entrada LIKE ? OR h.hora_salida LIKE ?";
            }
            $query .= " ORDER BY h.id DESC";
            
            if ($search) {
                $searchTerm = "%$search%";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
            } else {
                $stmt = $conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $horarios = [];
            while ($row = $result->fetch_assoc()) {
                $horarios[] = $row;
            }
            $stmt->close();
            echo json_encode(['success' => true, 'horarios' => $horarios]);
        }
        break;
        
    case 'update':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id = $_POST['id'] ?? '';
        $id_empleado = $_POST['id_empleado'] ?? '';
        $hora_entrada = $_POST['hora_entrada'] ?? '';
        $hora_salida = $_POST['hora_salida'] ?? '';
        
        $stmt = $conn->prepare("UPDATE horarios SET id_empleado = ?, hora_entrada = ?, hora_salida = ? WHERE id = ?");
        $stmt->bind_param("issi", $id_empleado, $hora_entrada, $hora_salida, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Horario actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar horario']);
        }
        $stmt->close();
        break;
        
    case 'delete':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM horarios WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Horario eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar horario']);
        }
        $stmt->close();
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

closeConnection($conn);
?>




