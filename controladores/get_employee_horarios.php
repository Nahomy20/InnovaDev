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

$stmt = $conn->prepare("SELECT hora_entrada, hora_salida FROM horarios WHERE id_empleado = ?");
$stmt->bind_param("i", $id_empleado);
$stmt->execute();
$result = $stmt->get_result();
$horario = $result->fetch_assoc();

$stmt->close();
closeConnection($conn);

if ($horario) {
    echo json_encode(['success' => true, 'hora_entrada' => $horario['hora_entrada'], 'hora_salida' => $horario['hora_salida']]);
} else {
    echo json_encode(['success' => true, 'hora_entrada' => null, 'hora_salida' => null]);
}
?>




