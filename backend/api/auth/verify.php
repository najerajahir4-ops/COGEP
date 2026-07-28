<?php
/**
 * Endpoint: POST /api/auth/verify (o /api/auth/verify.php)
 * Verifica el código de correo de un usuario.
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

if (empty($email) || empty($code)) {
    http_response_code(400);
    echo json_encode(['message' => 'El correo electrónico y el código de 6 dígitos son obligatorios.']);
    exit;
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT u.id, u.name, u.email, u.verification_code, u.verification_expires, u.verification_attempts, u.is_verified, u.role_id, r.name AS role_name 
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.email = :email
");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'El usuario no existe.']);
    exit;
}

if ((int)$user['is_verified'] === 1) {
    http_response_code(200);
    echo json_encode(['message' => 'Esta cuenta ya se encuentra verificada y activa.']);
    exit;
}

$attempts = (int)$user['verification_attempts'];

if ($attempts >= 5) {
    http_response_code(400);
    echo json_encode(['message' => 'Has superado el límite de 5 intentos fallidos. Solicita un nuevo código de verificación.']);
    exit;
}

// Validar el código hasheado
if (empty($user['verification_code']) || !password_verify($code, $user['verification_code'])) {
    $newAttempts = $attempts + 1;
    
    $stmt = $pdo->prepare("UPDATE users SET verification_attempts = :attempts WHERE id = :id");
    $stmt->execute(['attempts' => $newAttempts, 'id' => $user['id']]);

    http_response_code(400);
    if ($newAttempts >= 5) {
        echo json_encode(['message' => 'Código inválido. Has superado el límite de 5 intentos. Solicita un nuevo código de verificación.']);
    } else {
        echo json_encode(['message' => 'Código de verificación inválido. Te quedan ' . (5 - $newAttempts) . ' intento(s).']);
    }
    exit;
}

// Verificar si el código ha expirado
$expiresTime = strtotime($user['verification_expires']);
if ($expiresTime < time()) {
    http_response_code(400);
    echo json_encode([
        'message' => 'código expirado',
        'error_type' => 'expired'
    ]);
    exit;
}

// Todo correcto: marcar como verificado y resetear intentos
try {
    $stmt = $pdo->prepare("
        UPDATE users 
        SET is_verified = 1, verification_code = NULL, verification_expires = NULL, verification_attempts = 0 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $user['id']]);

    // Autologin: Generar sesión automáticamente
    $userData = [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role_name'],
        'role_id' => (int)$user['role_id']
    ];

    $token = generateToken($userData);

    http_response_code(200);
    echo json_encode([
        'message' => 'Tu cuenta ha sido verificada y activada con éxito.',
        'token' => $token,
        'user' => $userData
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al activar la cuenta en la base de datos', 'error' => $e->getMessage()]);
}
