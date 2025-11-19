<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Inicie sesión.']);
    exit;
}

if ($_SESSION['rol'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Solo administradores.']);
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
        // Leer id_empleado (puede venir como id_empleado o id_empleado_usuario)
        $id_empleado = $_POST['id_empleado'] ?? $_POST['id_empleado_usuario'] ?? null;
        // Convertir string vacío a null
        if ($id_empleado === '' || $id_empleado === '0') {
            $id_empleado = null;
        } else {
            $id_empleado = (int)$id_empleado;
        }
        
        $usuario = $_POST['usuario'] ?? '';
        // Leer contraseña (puede venir como password o contraseña)
        $password = $_POST['password'] ?? $_POST['contraseña'] ?? '';
        $rol = $_POST['rol'] ?? 'empleado';
        
        // Validar campos requeridos
        if (empty($usuario) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
            break;
        }
        
        // Verificar si el usuario ya existe
        $check = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
        $check->bind_param("s", $usuario);
        $check->execute();
        $result = $check->get_result();
        if ($result->num_rows > 0) {
            $check->close();
            echo json_encode(['success' => false, 'message' => 'El nombre de usuario ya existe']);
            break;
        }
        $check->close();
        
        // Verificar si el id_empleado ya tiene un usuario
        if ($id_empleado) {
            $check_empleado = $conn->prepare("SELECT id FROM usuarios WHERE id_empleado = ?");
            $check_empleado->bind_param("i", $id_empleado);
            $check_empleado->execute();
            $result_empleado = $check_empleado->get_result();
            if ($result_empleado->num_rows > 0) {
                $check_empleado->close();
                echo json_encode(['success' => false, 'message' => 'Este empleado ya tiene un usuario asignado']);
                break;
            }
            $check_empleado->close();
        }
        
        $stmt = $conn->prepare("INSERT INTO usuarios (id_empleado, usuario, contraseña, rol) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $id_empleado, $usuario, $password, $rol);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar usuario: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'read':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("SELECT u.*, e.nombre as empleado_nombre FROM usuarios u LEFT JOIN empleados e ON u.id_empleado = e.id WHERE u.id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $usuario = $result->fetch_assoc();
            $stmt->close();
            echo json_encode(['success' => true, 'usuario' => $usuario]);
        } else {
            $search = $_GET['search'] ?? '';
            $query = "SELECT u.*, e.nombre as empleado_nombre FROM usuarios u LEFT JOIN empleados e ON u.id_empleado = e.id";
            if ($search) {
                $query .= " WHERE u.usuario LIKE ? OR e.nombre LIKE ? OR u.rol LIKE ?";
            }
            $query .= " ORDER BY u.id DESC";
            
            if ($search) {
                $searchTerm = "%$search%";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
            } else {
                $stmt = $conn->prepare($query);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $usuarios = [];
            while ($row = $result->fetch_assoc()) {
                $usuarios[] = $row;
            }
            $stmt->close();
            echo json_encode(['success' => true, 'usuarios' => $usuarios]);
        }
        break;
        
    case 'update':
        $id = $_POST['id'] ?? '';
        // Leer id_empleado (puede venir como id_empleado o id_empleado_usuario)
        $id_empleado = $_POST['id_empleado'] ?? $_POST['id_empleado_usuario'] ?? null;
        // Convertir string vacío a null
        if ($id_empleado === '' || $id_empleado === '0') {
            $id_empleado = null;
        } else {
            $id_empleado = (int)$id_empleado;
        }
        
        $usuario = $_POST['usuario'] ?? '';
        // Leer contraseña (puede venir como password o contraseña)
        $password = $_POST['password'] ?? $_POST['contraseña'] ?? '';
        $rol = $_POST['rol'] ?? 'empleado';
        
        // Validar campos requeridos
        if (empty($usuario)) {
            echo json_encode(['success' => false, 'message' => 'Usuario es requerido']);
            break;
        }
        
        // Verificar si el nombre de usuario ya existe para otro ID
        $check = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ? AND id != ?");
        $check->bind_param("si", $usuario, $id);
        $check->execute();
        $result = $check->get_result();
        if ($result->num_rows > 0) {
            $check->close();
            echo json_encode(['success' => false, 'message' => 'El nombre de usuario ya existe']);
            break;
        }
        $check->close();
        
        // Verificar si el id_empleado ya tiene un usuario asignado a otro ID
        if ($id_empleado) {
            $check_empleado = $conn->prepare("SELECT id FROM usuarios WHERE id_empleado = ? AND id != ?");
            $check_empleado->bind_param("ii", $id_empleado, $id);
            $check_empleado->execute();
            $result_empleado = $check_empleado->get_result();
            if ($result_empleado->num_rows > 0) {
                $check_empleado->close();
                echo json_encode(['success' => false, 'message' => 'Este empleado ya tiene un usuario asignado']);
                break;
            }
            $check_empleado->close();
        }
        
        if ($password) {
            $stmt = $conn->prepare("UPDATE usuarios SET id_empleado = ?, usuario = ?, contraseña = ?, rol = ? WHERE id = ?");
            $stmt->bind_param("isssi", $id_empleado, $usuario, $password, $rol, $id);
        } else {
            $stmt = $conn->prepare("UPDATE usuarios SET id_empleado = ?, usuario = ?, rol = ? WHERE id = ?");
            $stmt->bind_param("issi", $id_empleado, $usuario, $rol, $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar usuario: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'delete':
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario']);
        }
        $stmt->close();
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

closeConnection($conn);
?>




