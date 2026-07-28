<?php
/**
 * Endpoint: POST /api/auth/reset-password (o /api/auth/reset-password.php)
 * Verifica el código de recuperación y cambia la contraseña del usuario.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim(strtolower($input['email'] ?? ''));
$code = trim($input['code'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($code) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Todos los campos son obligatorios (correo, código y nueva contraseña).']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Buscar usuario
    $stmt = $pdo->prepare("SELECT id, reset_code, reset_expires FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user || empty($user['reset_code'])) {
        http_response_code(400);
        echo json_encode(['message' => 'No se ha solicitado una recuperación de contraseña para esta cuenta o el código ya fue utilizado.']);
        exit;
    }
    
    // Validar expiración
    if (strtotime($user['reset_expires']) < time()) {
        http_response_code(400);
        echo json_encode(['message' => 'El código de recuperación ha expirado. Por favor, solicita uno nuevo.']);
        exit;
    }
    
    // Validar código
    if (!password_verify($code, $user['reset_code'])) {
        http_response_code(400);
        echo json_encode(['message' => 'El código de recuperación ingresado es incorrecto.']);
        exit;
    }
    
    // Hashear y actualizar contraseña
    $newPasswordHash = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("
        UPDATE users 
        SET password_hash = :password_hash, reset_code = NULL, reset_expires = NULL 
        WHERE id = :id
    ");
    $stmt->execute([
        'password_hash' => $newPasswordHash,
        'id' => $user['id']
    ]);
    
    http_response_code(200);
    echo json_encode(['message' => 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error en el servidor al restablecer contraseña', 'error' => $e->getMessage()]);
}
