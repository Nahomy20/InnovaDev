<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $usuario = $data['usuario'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($usuario) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
        exit;
    }
    
    try {
        $conn = getConnection();
        
        if (!$conn) {
            echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
            exit;
        }
        
        // Buscar usuario
        $stmt = $conn->prepare("SELECT u.id, u.usuario, u.contraseña, u.rol, u.id_empleado, e.nombre, e.cargo, e.area 
                                FROM usuarios u 
                                LEFT JOIN empleados e ON u.id_empleado = e.id 
                                WHERE u.usuario = ?");
        
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
            closeConnection($conn);
            exit;
        }
        
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verificar contraseña (en producción usar password_verify con hash)
            if ($user['contraseña'] === $password) {
                // Regenerar ID de sesión por seguridad
                session_regenerate_id(true);
                
                // Guardar datos en sesión
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['usuario'] = $user['usuario'];
                $_SESSION['rol'] = $user['rol'];
                $_SESSION['id_empleado'] = $user['id_empleado'];
                $_SESSION['nombre'] = $user['nombre'] ?? $user['usuario'];
                $_SESSION['cargo'] = $user['cargo'] ?? '';
                $_SESSION['area'] = $user['area'] ?? '';
                
                // Determinar la ruta de redirección según el rol
                // Las rutas son relativas desde la raíz del proyecto
                if ($user['rol'] === 'admin') {
                    $redirect = 'main_layout.html';
                } else {
                    $redirect = 'vistas/employee_layout.html';
                }
                
                $stmt->close();
                closeConnection($conn);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Login exitoso',
                    'rol' => $user['rol'],
                    'redirect' => $redirect
                ]);
                exit;
            } else {
                $stmt->close();
                closeConnection($conn);
                echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
                exit;
            }
        } else {
            $stmt->close();
            closeConnection($conn);
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
            exit;
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>




