<?php
/**
 * Endpoint: POST /api/auth/resend (o /api/auth/resend.php)
 * Reenvía un nuevo código de verificación al correo electrónico.
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

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, name, email, is_verified, last_code_sent_at FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'El usuario no existe.']);
    exit;
}

if ((int)$user['is_verified'] === 1) {
    http_response_code(200);
    echo json_encode(['message' => 'Esta cuenta ya está verificada y activa.']);
    exit;
}

// Comprobar Rate Limiting (60 segundos)
if (!empty($user['last_code_sent_at'])) {
    $lastSent = strtotime($user['last_code_sent_at']);
    $diff = time() - $lastSent;
    if ($diff < 60) {
        $wait = 60 - $diff;
        http_response_code(429);
        echo json_encode(['message' => "Espera {$wait} segundos antes de reenviar otro código."]);
        exit;
    }
}

// Regenerar código y actualizar datos
$code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$codeHash = password_hash($code, PASSWORD_BCRYPT);
$expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

try {
    $stmt = $pdo->prepare("
        UPDATE users 
        SET verification_code = :code, verification_expires = :expires, 
            verification_attempts = 0, last_code_sent_at = :last_code_sent_at 
        WHERE id = :id
    ");
    $stmt->execute([
        'code' => $codeHash,
        'expires' => $expires,
        'last_code_sent_at' => date('Y-m-d H:i:s'),
        'id' => $user['id']
    ]);

    // Enviar correo
    sendVerificationEmail($user['email'], $user['name'], $code);

    http_response_code(200);
    echo json_encode(['message' => 'Se ha enviado un nuevo código de verificación a tu correo electrónico.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al regenerar el código en la base de datos', 'error' => $e->getMessage()]);
}
