<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

// Permitir acceso a empleados para ver la lista (solo lectura)
if (!isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Inicie sesión.']);
    exit;
}

// Solo admin puede hacer modificaciones
$isAdmin = isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin';

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        if (!$isAdmin) {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores pueden crear empleados.']);
            break;
        }
        $nombre = $_POST['nombre'] ?? '';
        $cargo = $_POST['cargo'] ?? '';
        $area = $_POST['area'] ?? '';
        $estado = $_POST['estado'] ?? 'activo';
        
        $stmt = $conn->prepare("INSERT INTO empleados (nombre, cargo, area, estado) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nombre, $cargo, $area, $estado);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Empleado registrado correctamente', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar empleado: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'read':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM empleados WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $empleado = $result->fetch_assoc();
            $stmt->close();
            echo json_encode(['success' => true, 'empleado' => $empleado]);
        } else {
            $search = $_GET['search'] ?? '';
            $query = "SELECT * FROM empleados";
            if ($search) {
                $query .= " WHERE nombre LIKE ? OR cargo LIKE ? OR area LIKE ? OR id LIKE ?";
            }
            $query .= " ORDER BY id DESC";
            
            if ($search) {
                $searchTerm = "%$search%";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
            } else {
                $stmt = $conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $empleados = [];
            while ($row = $result->fetch_assoc()) {
                $empleados[] = $row;
            }
            $stmt->close();
            echo json_encode(['success' => true, 'empleados' => $empleados]);
        }
        break;
        
    case 'update':
        if (!$isAdmin) {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores pueden actualizar empleados.']);
            break;
        }
        $id = $_POST['id'] ?? '';
        $nombre = $_POST['nombre'] ?? '';
        $cargo = $_POST['cargo'] ?? '';
        $area = $_POST['area'] ?? '';
        $estado = $_POST['estado'] ?? 'activo';
        
        $stmt = $conn->prepare("UPDATE empleados SET nombre = ?, cargo = ?, area = ?, estado = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $nombre, $cargo, $area, $estado, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Empleado actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar empleado']);
        }
        $stmt->close();
        break;
        
    case 'delete':
        if (!$isAdmin) {
            echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores pueden eliminar empleados.']);
            break;
        }
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM empleados WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Empleado eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar empleado']);
        }
        $stmt->close();
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

closeConnection($conn);
?>




