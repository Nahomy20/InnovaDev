<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['id_empleado'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$id_empleado = $_SESSION['id_empleado'] ?? null;

if (!$id_empleado) {
    echo json_encode(['success' => false, 'message' => 'ID de empleado no encontrado en la sesión']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos del empleado
$stmt = $conn->prepare("SELECT nombre, cargo, area FROM empleados WHERE id = ?");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$empleado = $result->fetch_assoc();
$stmt->close();

// Obtener horario
$stmt = $conn->prepare("SELECT hora_entrada, hora_salida FROM horarios WHERE id_empleado = ?");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$horario = $result->fetch_assoc();
$stmt->close();

// Contar asistencias del mes
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM asistencias WHERE id_empleado = ? AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$asistencias_mes = $result->fetch_assoc()['total'];
$stmt->close();

// Contar permisos activos
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM permisos WHERE id_empleado = ? AND estado = 'aprobado' AND fecha_fin >= CURDATE()");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$permisos_activos = $result->fetch_assoc()['total'];
$stmt->close();

// Obtener últimas asistencias
$stmt = $conn->prepare("SELECT fecha, hora_entrada, hora_salida, estado FROM asistencias WHERE id_empleado = ? ORDER BY fecha DESC LIMIT 5");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$ultimas_asistencias = [];
while ($row = $result->fetch_assoc()) {
    $ultimas_asistencias[] = $row;
}
$stmt->close();

closeConnection($conn);

echo json_encode([
    'success' => true,
    'nombre' => $empleado['nombre'],
    'cargo' => $empleado['cargo'],
    'area' => $empleado['area'],
    'hora_entrada' => $horario['hora_entrada'] ?? null,
    'hora_salida' => $horario['hora_salida'] ?? null,
    'asistencias_mes' => $asistencias_mes,
    'permisos_activos' => $permisos_activos,
    'ultimas_asistencias' => $ultimas_asistencias
]);
?>




