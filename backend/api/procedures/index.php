<?php
/**
 * Endpoint: GET /api/procedures (o GET /api/procedures/index.php)
 * Retorna todos los procedimientos (evaluaciones) registrados en la base de datos.
 */
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$pdo = getDBConnection();

try {
    $stmt = $pdo->query("SELECT * FROM procedures ORDER BY created_at ASC");
    $procedures = $stmt->fetchAll();
    
    echo json_encode($procedures);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al obtener procedimientos', 'error' => $e->getMessage()]);
}
