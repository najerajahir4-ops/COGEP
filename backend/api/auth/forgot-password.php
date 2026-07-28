<?php
/**
 * Endpoint: POST /api/auth/forgot-password (o /api/auth/forgot-password.php)
 * Genera un código de 6 dígitos para recuperación de contraseña y lo envía por correo.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/mail_helper.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim(strtolower($input['email'] ?? ''));

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['message' => 'El correo electrónico es obligatorio.']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Buscar si el usuario existe
    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['message' => 'El correo electrónico ingresado no está registrado.']);
        exit;
    }
    
    // Generar código de 6 dígitos
    $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $codeHash = password_hash($code, PASSWORD_BCRYPT);
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour')); // 1 hora de validez
    
    // Guardar en la base de datos
    try {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET reset_code = :code, reset_expires = :expires 
            WHERE id = :id
        ");
        $stmt->execute([
            'code' => $codeHash,
            'expires' => $expires,
            'id' => $user['id']
        ]);
    } catch (PDOException $e) {
        // Auto-migración si las columnas no existen
        if (strpos($e->getMessage(), 'Unknown column') !== false) {
            $pdo->exec("ALTER TABLE users ADD COLUMN reset_code VARCHAR(255) NULL");
            $pdo->exec("ALTER TABLE users ADD COLUMN reset_expires DATETIME NULL");
            
            $stmt = $pdo->prepare("
                UPDATE users 
                SET reset_code = :code, reset_expires = :expires 
                WHERE id = :id
            ");
            $stmt->execute([
                'code' => $codeHash,
                'expires' => $expires,
                'id' => $user['id']
            ]);
        } else {
            throw $e;
        }
    }
    
    // Enviar correo electrónico
    sendRecoveryEmail($user['email'], $user['name'], $code);
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Se ha enviado un código de recuperación a tu correo electrónico.',
        'email' => $user['email']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error: ' . $e->getMessage(), 'error' => $e->getMessage()]);
}
