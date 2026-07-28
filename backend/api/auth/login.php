<?php
/**
 * Endpoint: POST /api/auth/login (o /api/auth/login.php)
 * Autentica un usuario contra la base de datos MySQL.
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
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Por favor ingrese correo electrónico y contraseña.']);
    exit;
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT u.id, u.name, u.email, u.avatar, u.password_hash, u.role_id, u.is_verified, r.name AS role_name 
    FROM users u 
    INNER JOIN roles r ON u.role_id = r.id 
    WHERE u.email = :email
");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Credenciales incorrectas. Verifique correo y contraseña.']);
    exit;
}

if ((int)$user['is_verified'] === 0) {
    http_response_code(403);
    echo json_encode([
        'message' => 'Tu cuenta aún no está verificada. Por favor, verifica tu correo antes de iniciar sesión.',
        'email' => $user['email'],
        'verified' => false
    ]);
    exit;
}

$userData = [
    'id' => (int)$user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'avatar' => $user['avatar'],
    'role' => $user['role_name'],
    'role_id' => (int)$user['role_id']
];

$token = generateToken($userData);

http_response_code(200);
echo json_encode([
    'message' => 'Inicio de sesión exitoso',
    'token' => $token,
    'user' => $userData
]);
