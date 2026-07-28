<?php
/**
 * Endpoint: GET /api/questions (o /api/questions/index.php)
 * Lista preguntas y sus opciones. Opcionalmente filtrado por procedure_id.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';

handleCors();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$procedureId = $_GET['procedure'] ?? $_GET['procedure_id'] ?? null;
$pdo = getDBConnection();

if ($procedureId) {
    $stmt = $pdo->prepare("SELECT * FROM questions WHERE procedure_id = :proc ORDER BY id ASC");
    $stmt->execute(['proc' => $procedureId]);
} else {
    $stmt = $pdo->query("SELECT * FROM questions ORDER BY id ASC");
}

$questions = $stmt->fetchAll();

$result = [];
foreach ($questions as $q) {
    $stmtOpt = $pdo->prepare("SELECT id, option_text, is_correct FROM question_options WHERE question_id = :qid ORDER BY id ASC");
    $stmtOpt->execute(['qid' => $q['id']]);
    $options = $stmtOpt->fetchAll();

    $result[] = [
        'id' => (int)$q['id'],
        'db_id' => (int)$q['id'],
        'procedure_id' => $q['procedure_id'],
        'question_text' => $q['question_text'],
        'explanation' => $q['explanation'],
        'created_at' => $q['created_at'],
        'options' => array_map(function($opt) {
            return [
                'id' => (int)$opt['id'],
                'option_text' => $opt['option_text'],
                'is_correct' => (bool)$opt['is_correct']
            ];
        }, $options)
    ];
}

echo json_encode($result);
