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
$tipo = $_GET['tipo'] ?? '';

switch ($tipo) {
    case 'empleados':
        $estado = $_GET['estado'] ?? '';
        $area = $_GET['area'] ?? '';
        $cargo = $_GET['cargo'] ?? '';
        
        $query = "SELECT * FROM empleados WHERE 1=1";
        $params = [];
        $types = '';
        
        if ($estado) {
            $query .= " AND estado = ?";
            $params[] = $estado;
            $types .= 's';
        }
        if ($area) {
            $query .= " AND area LIKE ?";
            $params[] = "%$area%";
            $types .= 's';
        }
        if ($cargo) {
            $query .= " AND cargo LIKE ?";
            $params[] = "%$cargo%";
            $types .= 's';
        }
        
        $query .= " ORDER BY id DESC";
        
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'empleados' => $data]);
        break;
        
    case 'asistencias':
        $fecha_inicio = $_GET['fecha_inicio'] ?? '';
        $fecha_fin = $_GET['fecha_fin'] ?? '';
        $id_empleado = $_GET['id_empleado'] ?? '';
        $estado = $_GET['estado'] ?? '';
        
        $query = "SELECT a.*, e.nombre as empleado_nombre, e.cargo, e.area 
                  FROM asistencias a 
                  JOIN empleados e ON a.id_empleado = e.id 
                  WHERE 1=1";
        
        $params = [];
        $types = '';
        
        if ($fecha_inicio) {
            $query .= " AND a.fecha >= ?";
            $params[] = $fecha_inicio;
            $types .= 's';
        }
        if ($fecha_fin) {
            $query .= " AND a.fecha <= ?";
            $params[] = $fecha_fin;
            $types .= 's';
        }
        if ($id_empleado) {
            $query .= " AND a.id_empleado = ?";
            $params[] = $id_empleado;
            $types .= 'i';
        }
        if ($estado) {
            $query .= " AND a.estado = ?";
            $params[] = $estado;
            $types .= 's';
        }
        
        $query .= " ORDER BY a.fecha DESC";
        
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'data' => $data]);
        break;
        
    case 'horarios':
        $id_empleado = $_GET['id_empleado'] ?? '';
        $query = "SELECT h.*, e.nombre as empleado_nombre, e.cargo, e.area 
                  FROM horarios h 
                  JOIN empleados e ON h.id_empleado = e.id";
        if ($id_empleado) {
            $query .= " WHERE h.id_empleado = ?";
        }
        $query .= " ORDER BY h.id DESC";
        
        $stmt = $conn->prepare($query);
        if ($id_empleado) {
            $stmt->bind_param("i", $id_empleado);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'data' => $data]);
        break;
        
    case 'permisos':
        $fecha_inicio = $_GET['fecha_inicio'] ?? '';
        $fecha_fin = $_GET['fecha_fin'] ?? '';
        $estado = $_GET['estado'] ?? '';
        $id_empleado = $_GET['id_empleado'] ?? '';
        
        $query = "SELECT p.*, e.nombre as empleado_nombre, e.cargo, e.area 
                  FROM permisos p 
                  JOIN empleados e ON p.id_empleado = e.id 
                  WHERE 1=1";
        
        $params = [];
        $types = '';
        
        if ($fecha_inicio) {
            $query .= " AND p.fecha_inicio >= ?";
            $params[] = $fecha_inicio;
            $types .= 's';
        }
        if ($fecha_fin) {
            $query .= " AND p.fecha_fin <= ?";
            $params[] = $fecha_fin;
            $types .= 's';
        }
        if ($estado) {
            $query .= " AND p.estado = ?";
            $params[] = $estado;
            $types .= 's';
        }
        if ($id_empleado) {
            $query .= " AND p.id_empleado = ?";
            $params[] = $id_empleado;
            $types .= 'i';
        }
        
        $query .= " ORDER BY p.fecha_inicio DESC";
        
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'data' => $data]);
        break;
        
    case 'usuarios':
        $rol = $_GET['rol'] ?? '';
        $query = "SELECT u.*, e.nombre as empleado_nombre, e.cargo, e.area 
                  FROM usuarios u 
                  LEFT JOIN empleados e ON u.id_empleado = e.id";
        if ($rol) {
            $query .= " WHERE u.rol = ?";
        }
        $query .= " ORDER BY u.id DESC";
        
        $stmt = $conn->prepare($query);
        if ($rol) {
            $stmt->bind_param("s", $rol);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'data' => $data]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Tipo de reporte no válido']);
}

closeConnection($conn);
?>




