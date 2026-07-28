<?php
/**
 * Endpoint: POST /api/questions/create.php (o POST /api/questions)
 * Crea una nueva pregunta y sus opciones asociadas.
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

$procedureId = trim($input['procedure_id'] ?? $input['procedure'] ?? '');
$questionText = trim($input['question_text'] ?? '');
$explanation = trim($input['explanation'] ?? '');
$options = $input['options'] ?? [];

if (empty($procedureId) || empty($questionText) || empty($options) || !is_array($options)) {
    http_response_code(400);
    echo json_encode(['message' => 'Faltan campos obligatorios para registrar la pregunta']);
    exit;
}

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO questions (procedure_id, question_text, explanation) VALUES (:proc, :qtext, :exp)");
    $stmt->execute([
        'proc' => $procedureId,
        'qtext' => $questionText,
        'exp' => $explanation
    ]);

    $questionId = $pdo->lastInsertId();

    $stmtOpt = $pdo->prepare("INSERT INTO question_options (question_id, option_text, is_correct) VALUES (:qid, :otext, :is_correct)");
    foreach ($options as $opt) {
        $optionText = is_array($opt) ? ($opt['option_text'] ?? $opt['text'] ?? '') : (string)$opt;
        $isCorrect = is_array($opt) ? (!empty($opt['is_correct']) ? 1 : 0) : 0;

        $stmtOpt->execute([
            'qid' => $questionId,
            'otext' => $optionText,
            'is_correct' => $isCorrect
        ]);
    }

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'message' => 'Pregunta registrada exitosamente',
        'id' => (int)$questionId,
        'db_id' => (int)$questionId
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['message' => 'Error al guardar la pregunta', 'error' => $e->getMessage()]);
}
