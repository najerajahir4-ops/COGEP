<?php
/**
 * Endpoint: GET /api/attempts/stats (o /api/attempts/stats.php)
 * Retorna las estadísticas globales de los intentos de los estudiantes
 * y la lista de evaluaciones asociadas, agrupado/filtrado para el docente.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Requerir rol de docente o administrador
$authUser = requireRole(['docente', 'administrador']);
$pdo = getDBConnection();

try {
    // 1. Obtener todos los cuestionarios/procedimientos creados
    $stmtProcs = $pdo->query("
        SELECT id, title, description, articles, image, availability, open_at, period, created_at 
        FROM procedures 
        ORDER BY created_at ASC
    ");
    $procedures = $stmtProcs->fetchAll();

    // 2. Obtener todos los intentos de los estudiantes
    $stmtAttempts = $pdo->query("
        SELECT 
            qa.id AS attempt_id,
            qa.user_id,
            u.name AS student_name,
            u.email AS student_email,
            qa.procedure_id,
            p.title AS procedure_title,
            p.period AS procedure_period,
            qa.score,
            qa.started_at,
            qa.completed_at
        FROM quiz_attempts qa
        INNER JOIN users u ON qa.user_id = u.id
        INNER JOIN procedures p ON qa.procedure_id = p.id
        ORDER BY qa.completed_at DESC
    ");
    $attempts = $stmtAttempts->fetchAll();

    echo json_encode([
        'procedures' => $procedures,
        'attempts' => $attempts
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error al recopilar estadísticas del sistema',
        'error' => $e->getMessage()
    ]);
}
