<?php
/**
 * Endpoint: POST /api/attempts/start (o /api/attempts/start.php)
 * Inicia un nuevo intento de cuestionario en la base de datos MySQL.
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

$authUser = getAuthenticatedUser();
$userId = $authUser ? $authUser['id'] : ($input['user_id'] ?? 1);
$procedureId = trim($input['procedure_id'] ?? $input['procedure'] ?? 'ordinario');

$pdo = getDBConnection();

try {
    $stmt = $pdo->prepare("INSERT INTO quiz_attempts (user_id, procedure_id, started_at) VALUES (:uid, :proc, NOW())");
    $stmt->execute([
        'uid' => $userId,
        'proc' => $procedureId
    ]);

    $attemptId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'id' => (int)$attemptId,
        'dbId' => (int)$attemptId,
        'attemptId' => (int)$attemptId,
        'user_id' => (int)$userId,
        'procedure_id' => $procedureId,
        'message' => 'Intento de cuestionario iniciado correctamente'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al iniciar el intento', 'error' => $e->getMessage()]);
}
