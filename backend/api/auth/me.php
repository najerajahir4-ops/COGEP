<?php
/**
 * Endpoint: GET /api/auth/me (o /api/auth/me.php)
 * Retorna la información del usuario actualmente autenticado.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

$authUser = requireAuth();

$pdo = getDBConnection();
$stmt = $pdo->prepare("
    SELECT u.id, u.name, u.email, u.role_id, r.name AS role_name, u.created_at
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = :id
");
$stmt->execute(['id' => $authUser['id']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'Usuario no encontrado']);
    exit;
}

http_response_code(200);
echo json_encode([
    'id' => (int)$user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'role' => $user['role_name'],
    'role_id' => (int)$user['role_id'],
    'created_at' => $user['created_at']
]);
