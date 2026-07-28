<?php
/**
 * Endpoint: DELETE /api/procedures/delete (o /api/procedures/{id} con método DELETE)
 * Elimina una evaluación (procedimiento) completa con todas sus preguntas asociadas.
 */
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$authUser = getAuthenticatedUser();
if (!$authUser || ($authUser['role'] !== 'administrador' && $authUser['role'] !== 'docente')) {
    http_response_code(403);
    echo json_encode(['message' => 'Acceso denegado: Se requiere perfil de docente o administrador.']);
    exit;
}

$id = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de procedimiento no especificado']);
    exit;
}

$pdo = getDBConnection();

try {
    $stmt = $pdo->prepare("DELETE FROM procedures WHERE id = :id");
    $stmt->execute(['id' => $id]);

    http_response_code(200);
    echo json_encode(['message' => 'Evaluación eliminada exitosamente de la base de datos', 'id' => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al eliminar la evaluación', 'error' => $e->getMessage()]);
}
