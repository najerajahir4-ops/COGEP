<?php
/**
 * Endpoint: POST /api/attempts/submit.php?id={id} (o /api/attempts/{id}/submit)
 * Finaliza y califica un intento de cuestionario.
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

$attemptId = $_GET['id'] ?? $_GET['attempt_id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

if (!$attemptId && isset($input['attempt_id'])) {
    $attemptId = $input['attempt_id'];
}

if (!$attemptId) {
    http_response_code(400);
    echo json_encode(['message' => 'ID de intento no especificado']);
    exit;
}

$answers = $input['answers'] ?? [];
$score = isset($input['score']) ? (float)$input['score'] : null;

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    $totalQuestions = 0;
    $correctAnswers = 0;

    $stmtAns = $pdo->prepare("INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id) VALUES (:aid, :qid, :opt_id)");

    foreach ($answers as $qid => $selectedOptId) {
        $questionId = (int)$qid;
        $optId = is_numeric($selectedOptId) ? (int)$selectedOptId : null;

        $stmtAns->execute([
            'aid' => $attemptId,
            'qid' => $questionId,
            'opt_id' => $optId
        ]);

        if ($optId !== null) {
            $stmtCheck = $pdo->prepare("SELECT is_correct FROM question_options WHERE id = :opt_id AND question_id = :qid");
            $stmtCheck->execute(['opt_id' => $optId, 'qid' => $questionId]);
            $optRow = $stmtCheck->fetch();
            if ($optRow && $optRow['is_correct']) {
                $correctAnswers++;
            }
        }
        $totalQuestions++;
    }

    if ($score === null && $totalQuestions > 0) {
        $score = round(($correctAnswers / $totalQuestions) * 100, 2);
    } elseif ($score === null) {
        $score = 0.00;
    }

    $stmtUpd = $pdo->prepare("UPDATE quiz_attempts SET score = :score, completed_at = NOW() WHERE id = :aid");
    $stmtUpd->execute([
        'score' => $score,
        'aid' => $attemptId
    ]);

    $pdo->commit();

    http_response_code(200);
    echo json_encode([
        'message' => 'Cuestionario enviado y calificado exitosamente',
        'attempt_id' => (int)$attemptId,
        'score' => $score,
        'correct_count' => $correctAnswers,
        'total_questions' => $totalQuestions
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['message' => 'Error al guardar el resultado de la evaluación', 'error' => $e->getMessage()]);
}
