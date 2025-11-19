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
        $id_empleado = $_POST['id_empleado'] ?? ($_SESSION['id_empleado'] ?? '');
        $tipo_permiso = $_POST['tipo_permiso'] ?? '';
        $fecha_inicio = $_POST['fecha_inicio'] ?? '';
        $fecha_fin = $_POST['fecha_fin'] ?? '';
        $estado = $_POST['estado'] ?? 'pendiente';
        
        if (empty($id_empleado)) {
            echo json_encode(['success' => false, 'message' => 'Debe seleccionar un empleado']);
            break;
        }
        
        if (empty($tipo_permiso) || empty($fecha_inicio) || empty($fecha_fin)) {
            echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
            break;
        }
        
        $stmt = $conn->prepare("INSERT INTO permisos (id_empleado, tipo_permiso, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $id_empleado, $tipo_permiso, $fecha_inicio, $fecha_fin, $estado);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Permiso registrado correctamente', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar permiso: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'read':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT p.*, e.nombre as empleado_nombre FROM permisos p JOIN empleados e ON p.id_empleado = e.id WHERE p.id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $permiso = $result->fetch_assoc();
            $stmt->close();
            echo json_encode(['success' => true, 'permiso' => $permiso]);
        } else {
            $search = $_GET['search'] ?? '';
            $query = "SELECT p.*, e.nombre as empleado_nombre FROM permisos p JOIN empleados e ON p.id_empleado = e.id";
            if ($search) {
                $query .= " WHERE e.nombre LIKE ? OR p.tipo_permiso LIKE ? OR p.estado LIKE ?";
            }
            $query .= " ORDER BY p.fecha_inicio DESC";
            
            if ($search) {
                $searchTerm = "%$search%";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
            } else {
                $stmt = $conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $permisos = [];
            while ($row = $result->fetch_assoc()) {
                $permisos[] = $row;
            }
            $stmt->close();
            echo json_encode(['success' => true, 'permisos' => $permisos]);
        }
        break;
        
    case 'update':
        $id = $_POST['id'] ?? '';
        $id_empleado = $_POST['id_empleado'] ?? '';
        $tipo_permiso = $_POST['tipo_permiso'] ?? '';
        $fecha_inicio = $_POST['fecha_inicio'] ?? '';
        $fecha_fin = $_POST['fecha_fin'] ?? '';
        $estado = $_POST['estado'] ?? 'pendiente';
        
        $stmt = $conn->prepare("UPDATE permisos SET id_empleado = ?, tipo_permiso = ?, fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id = ?");
        $stmt->bind_param("issssi", $id_empleado, $tipo_permiso, $fecha_inicio, $fecha_fin, $estado, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Permiso actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar permiso']);
        }
        $stmt->close();
        break;
        
    case 'delete':
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
            break;
        }
        
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM permisos WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Permiso eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar permiso']);
        }
        $stmt->close();
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

closeConnection($conn);
?>




