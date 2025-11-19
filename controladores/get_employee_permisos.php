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

$stmt = $conn->prepare("SELECT tipo_permiso, fecha_inicio, fecha_fin, estado FROM permisos WHERE id_empleado = ? ORDER BY fecha_inicio DESC");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();

$permisos = [];
while ($row = $result->fetch_assoc()) {
    $permisos[] = $row;
}

$stmt->close();
closeConnection($conn);

echo json_encode(['success' => true, 'permisos' => $permisos]);
?>




