<?php
/**
 * Endpoint: /api/questions/detail.php?id={id} (o /api/questions/{id})
 * Actualizar o eliminar una pregunta y sus opciones asociadas.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

handleCors();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de pregunta no especificado']);
    exit;
}

$pdo = getDBConnection();

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM questions WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $q = $stmt->fetch();
    if (!$q) {
        http_response_code(404);
        echo json_encode(['message' => 'Pregunta no encontrada']);
        exit;
    }

    $stmtOpt = $pdo->prepare("SELECT id, option_text, is_correct FROM question_options WHERE question_id = :qid ORDER BY id ASC");
    $stmtOpt->execute(['qid' => $id]);
    $options = $stmtOpt->fetchAll();

    $q['options'] = array_map(function($opt) {
        return [
            'id' => (int)$opt['id'],
            'option_text' => $opt['option_text'],
            'is_correct' => (bool)$opt['is_correct']
        ];
    }, $options);

    echo json_encode($q);
    exit;
}

if ($method === 'PUT' || $method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);

    $procedureId = trim($input['procedure_id'] ?? $input['procedure'] ?? '');
    $questionText = trim($input['question_text'] ?? '');
    $explanation = trim($input['explanation'] ?? '');
    $options = $input['options'] ?? null;

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("UPDATE questions SET procedure_id = COALESCE(NULLIF(:proc, ''), procedure_id), question_text = COALESCE(NULLIF(:qtext, ''), question_text), explanation = COALESCE(NULLIF(:exp, ''), explanation) WHERE id = :id");
        $stmt->execute([
            'proc' => $procedureId,
            'qtext' => $questionText,
            'exp' => $explanation,
            'id' => $id
        ]);

        if (is_array($options)) {
            $pdo->prepare("DELETE FROM question_options WHERE question_id = :qid")->execute(['qid' => $id]);
            $stmtOpt = $pdo->prepare("INSERT INTO question_options (question_id, option_text, is_correct) VALUES (:qid, :otext, :is_correct)");
            foreach ($options as $opt) {
                $optionText = is_array($opt) ? ($opt['option_text'] ?? $opt['text'] ?? '') : (string)$opt;
                $isCorrect = is_array($opt) ? (!empty($opt['is_correct']) ? 1 : 0) : 0;
                $stmtOpt->execute([
                    'qid' => $id,
                    'otext' => $optionText,
                    'is_correct' => $isCorrect
                ]);
            }
        }

        $pdo->commit();
        echo json_encode(['message' => 'Pregunta actualizada correctamente']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['message' => 'Error al actualizar la pregunta', 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM questions WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(['message' => 'Pregunta eliminada correctamente']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
