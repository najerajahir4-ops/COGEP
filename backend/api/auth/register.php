<?php
/**
 * Endpoint: POST /api/auth/register (o /api/auth/register.php)
 * Registra un nuevo usuario en la base de datos MySQL.
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

$name = trim($input['name'] ?? '');
$email = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';
$roleInput = strtolower(trim($input['role'] ?? 'estudiante'));

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Todos los campos son obligatorios (nombre, correo, contraseña).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'El formato del correo electrónico no es válido.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['message' => 'La contraseña debe tener al menos 6 caracteres.']);
    exit;
}

require_once __DIR__ . '/../../config/mail_helper.php';

$pdo = getDBConnection();

// Verificar si el correo ya existe y su estado de verificación
$stmt = $pdo->prepare("SELECT id, is_verified FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$existingUser = $stmt->fetch();

// Obtener el role_id correspondiente
$stmt = $pdo->prepare("SELECT id, name FROM roles WHERE name = :role OR id = :role_id");
$stmt->execute(['role' => $roleInput, 'role_id' => is_numeric($roleInput) ? (int)$roleInput : 0]);
$roleRow = $stmt->fetch();

if (!$roleRow) {
    $roleId = 3;
    $roleName = 'estudiante';
} else {
    $roleId = (int)$roleRow['id'];
    $roleName = $roleRow['name'];
}

$passwordHash = password_hash($password, PASSWORD_BCRYPT);
$code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$codeHash = password_hash($code, PASSWORD_BCRYPT);
$expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

if ($existingUser) {
    if ((int)$existingUser['is_verified'] === 1) {
        http_response_code(409);
        echo json_encode(['message' => 'El correo electrónico ya se encuentra registrado y verificado.']);
        exit;
    } else {
        // Usuario existe pero no está verificado: actualizamos su info y generamos un nuevo código
        try {
            $stmt = $pdo->prepare("
                UPDATE users 
                SET name = :name, password_hash = :password_hash, role_id = :role_id, 
                    verification_code = :code, verification_expires = :expires, 
                    verification_attempts = 0, last_code_sent_at = :last_code_sent_at 
                WHERE id = :id
            ");
            $stmt->execute([
                'name' => $name,
                'password_hash' => $passwordHash,
                'role_id' => $roleId,
                'code' => $codeHash,
                'expires' => $expires,
                'last_code_sent_at' => date('Y-m-d H:i:s'),
                'id' => $existingUser['id']
            ]);

            // Enviar correo electrónico
            sendVerificationEmail($email, $name, $code);

            http_response_code(200);
            echo json_encode([
                'message' => 'El usuario ya estaba registrado pero no verificado. Te hemos enviado un nuevo código de verificación.',
                'email' => $email,
                'verified' => false
            ]);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error al actualizar el código de verificación', 'error' => $e->getMessage()]);
            exit;
        }
    }
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password_hash, role_id, is_verified, verification_code, verification_expires, verification_attempts, last_code_sent_at) 
        VALUES (:name, :email, :password_hash, :role_id, 0, :code, :expires, 0, :last_code_sent_at)
    ");
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => $passwordHash,
        'role_id' => $roleId,
        'code' => $codeHash,
        'expires' => $expires,
        'last_code_sent_at' => date('Y-m-d H:i:s')
    ]);

    // Enviar correo electrónico
    sendVerificationEmail($email, $name, $code);

    http_response_code(201);
    echo json_encode([
        'message' => 'Usuario registrado exitosamente. Por favor verifica tu correo con el código enviado.',
        'email' => $email,
        'verified' => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al guardar el usuario en la base de datos', 'error' => $e->getMessage()]);
}
