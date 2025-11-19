<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos de la semana actual (últimos 7 días)
$dias_semana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
$datos_semana = [];

// Obtener el primer día de la semana (lunes)
$fecha_actual = new DateTime();
$dias_desde_lunes = ($fecha_actual->format('N') - 1); // N: 1 (lunes) a 7 (domingo)
$fecha_actual->modify("-{$dias_desde_lunes} days");

// Obtener datos para cada día de la semana
for ($i = 0; $i < 7; $i++) {
    $fecha = $fecha_actual->format('Y-m-d');
    $dia_nombre = $dias_semana[$i];
    
    // Contar asistencias (presente, tarde, permiso)
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM asistencias WHERE fecha = ? AND estado IN ('presente', 'tarde', 'permiso')");
    $stmt->bind_param("s", $fecha);
    $stmt->execute();
    $result = $stmt->get_result();
    $asistencias = $result->fetch_assoc()['total'];
    $stmt->close();
    
    // Calcular ausentes (empleados activos sin registro de asistencia o con estado ausente)
    $stmt = $conn->prepare("SELECT COUNT(DISTINCT e.id) as total 
                            FROM empleados e 
                            LEFT JOIN asistencias a ON e.id = a.id_empleado AND a.fecha = ?
                            WHERE e.estado = 'activo' AND (a.id IS NULL OR a.estado = 'ausente')");
    $stmt->bind_param("s", $fecha);
    $stmt->execute();
    $result = $stmt->get_result();
    $ausentes_reales = $result->fetch_assoc()['total'];
    $stmt->close();
    
    $datos_semana[] = [
        'dia' => $dia_nombre,
        'fecha' => $fecha,
        'asistencias' => (int)$asistencias,
        'ausencias' => (int)$ausentes_reales
    ];
    
    // Avanzar al siguiente día
    $fecha_actual->modify('+1 day');
}

closeConnection($conn);

echo json_encode([
    'success' => true,
    'datos' => $datos_semana
]);
?>

