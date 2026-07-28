<?php
/**
 * Endpoint: /api/users/detail.php?id={id} (o /api/users/{id})
 * Actualizar o eliminar usuario específico.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de usuario no especificado']);
    exit;
}

$pdo = getDBConnection();

if ($method === 'GET') {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.role_id, r.name AS role, u.created_at
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = :id
    ");
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch();
    if (!$user) {
        http_response_code(404);
        echo json_encode(['message' => 'Usuario no encontrado']);
        exit;
    }
    echo json_encode($user);
    exit;
}

if ($method === 'PUT' || $method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $email = trim(strtolower($input['email'] ?? ''));
    $roleInput = strtolower(trim($input['role'] ?? ''));

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['message' => 'Usuario no encontrado']);
        exit;
    }

    $updatedName = !empty($name) ? $name : $existing['name'];
    $updatedEmail = !empty($email) ? $email : $existing['email'];
    $updatedRoleId = $existing['role_id'];

    if (!empty($roleInput)) {
        $stmtRole = $pdo->prepare("SELECT id FROM roles WHERE name = :role OR id = :role_id");
        $stmtRole->execute(['role' => $roleInput, 'role_id' => is_numeric($roleInput) ? (int)$roleInput : 0]);
        $roleRow = $stmtRole->fetch();
        if ($roleRow) {
            $updatedRoleId = $roleRow['id'];
        }
    }

    $stmtUpdate = $pdo->prepare("UPDATE users SET name = :name, email = :email, role_id = :role_id WHERE id = :id");
    $stmtUpdate->execute([
        'name' => $updatedName,
        'email' => $updatedEmail,
        'role_id' => $updatedRoleId,
        'id' => $id
    ]);

    echo json_encode(['message' => 'Usuario actualizado correctamente']);
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(['message' => 'Usuario eliminado correctamente']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
