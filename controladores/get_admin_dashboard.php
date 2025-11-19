<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Rol: ' . ($_SESSION['rol'] ?? 'no definido')]);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// Contar empleados activos
$result = $conn->query("SELECT COUNT(*) as total FROM empleados WHERE estado = 'activo'");
if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Error en consulta: ' . $conn->error]);
    closeConnection($conn);
    exit;
}
$empleados_activos = $result->fetch_assoc()['total'];

// Contar ausentes hoy
$fecha_hoy = date('Y-m-d');
$result = $conn->query("SELECT COUNT(DISTINCT e.id) as total 
                        FROM empleados e 
                        LEFT JOIN asistencias a ON e.id = a.id_empleado AND a.fecha = '$fecha_hoy'
                        WHERE e.estado = 'activo' AND a.id IS NULL");
$ausentes_hoy = $result->fetch_assoc()['total'];

// Calcular tasa de puntualidad (últimos 30 días)
$result = $conn->query("SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) as puntuales
    FROM asistencias 
    WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
$stats = $result->fetch_assoc();
$tasa_puntualidad = $stats['total'] > 0 ? round(($stats['puntuales'] / $stats['total']) * 100) : 0;

// Obtener últimos fichajes
$result = $conn->query("SELECT a.id_empleado, a.hora_entrada, a.estado, e.nombre as empleado_nombre
                        FROM asistencias a
                        JOIN empleados e ON a.id_empleado = e.id
                        WHERE a.fecha = '$fecha_hoy'
                        ORDER BY a.hora_entrada DESC
                        LIMIT 10");
$ultimos_fichajes = [];
while ($row = $result->fetch_assoc()) {
    $ultimos_fichajes[] = $row;
}

closeConnection($conn);

echo json_encode([
    'success' => true,
    'empleados_activos' => $empleados_activos,
    'ausentes_hoy' => $ausentes_hoy,
    'tasa_puntualidad' => $tasa_puntualidad,
    'ultimos_fichajes' => $ultimos_fichajes
]);
?>




