<?php
/**
 * Endpoint: POST /api/users/update-avatar (o /api/users/update_avatar.php)
 * Actualiza la foto de perfil del usuario autenticado.
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

$authUser = requireAuth();

$input = json_decode(file_get_contents('php://input'), true);
$avatar = $input['avatar'] ?? null; // Espera una cadena Base64 (redimensionada y optimizada)

if ($avatar !== null && !empty($avatar)) {
    if (strpos($avatar, 'data:image/') !== 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Formato de imagen inválido. Debe ser una URI de datos de imagen.']);
        exit;
    }
}

$pdo = getDBConnection();

try {
    $stmt = $pdo->prepare("UPDATE users SET avatar = :avatar WHERE id = :id");
    $stmt->execute([
        'avatar' => $avatar,
        'id' => $authUser['id']
    ]);

    http_response_code(200);
    echo json_encode([
        'message' => 'Foto de perfil actualizada exitosamente',
        'avatar' => $avatar
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error al actualizar la foto de perfil',
        'error' => $e->getMessage()
    ]);
}
