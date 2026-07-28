<?php
/**
 * Endpoint: /api/users (o /api/users/index.php)
 * GET: Lista todos los usuarios.
 * POST: Crea un nuevo usuario.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT u.id, u.name, u.email, u.role_id, r.name AS role, r.name AS role_name, u.created_at
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        ORDER BY u.id ASC
    ");
    $users = $stmt->fetchAll();
    echo json_encode($users);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $email = trim(strtolower($input['email'] ?? ''));
    $password = $input['password'] ?? '12345678';
    $roleInput = strtolower(trim($input['role'] ?? 'estudiante'));

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['message' => 'Nombre y correo son obligatorios']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['message' => 'El correo ya está registrado']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, name FROM roles WHERE name = :role OR id = :role_id");
    $stmt->execute(['role' => $roleInput, 'role_id' => is_numeric($roleInput) ? (int)$roleInput : 0]);
    $roleRow = $stmt->fetch();

    $roleId = $roleRow ? (int)$roleRow['id'] : 3;
    $roleName = $roleRow ? $roleRow['name'] : 'estudiante';

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role_id) VALUES (:name, :email, :password_hash, :role_id)");
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => $passwordHash,
        'role_id' => $roleId
    ]);

    $userId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'id' => (int)$userId,
        'name' => $name,
        'email' => $email,
        'role' => $roleName,
        'role_id' => $roleId,
        'message' => 'Usuario creado exitosamente'
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
