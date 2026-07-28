<?php
/**
 * Endpoint: GET /api/attempts/my-attempts (o /api/attempts/my-attempts.php)
 * Retorna el historial de evaluaciones del usuario autenticado.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

$authUser = requireAuth();
$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT id, procedure_id, score, started_at, completed_at
    FROM quiz_attempts
    WHERE user_id = :uid
    ORDER BY started_at DESC
");
$stmt->execute(['uid' => $authUser['id']]);
$attempts = $stmt->fetchAll();

echo json_encode($attempts);
