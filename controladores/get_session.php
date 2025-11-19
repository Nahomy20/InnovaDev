<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'id' => $_SESSION['user_id'],
        'usuario' => $_SESSION['usuario'],
        'rol' => $_SESSION['rol'],
        'id_empleado' => $_SESSION['id_empleado'],
        'nombre' => $_SESSION['nombre'],
        'cargo' => $_SESSION['cargo'],
        'area' => $_SESSION['area']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'No hay sesión activa']);
}
?>




