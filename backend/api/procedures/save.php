<?php
/**
 * Endpoint: POST /api/procedures/save (o POST /api/procedures/save.php)
 * Guarda (crea o edita) una evaluación (procedimiento) completa con todas sus preguntas y opciones.
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

// Opcionalmente verificar que sea docente o administrador
$authUser = getAuthenticatedUser();
$role = strtolower($authUser['role'] ?? '');
if (!$authUser || ($role !== 'administrador' && $role !== 'docente')) {
    http_response_code(403);
    echo json_encode(['message' => 'Acceso denegado: Se requiere perfil de docente o administrador.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$id = trim($input['id'] ?? '');
$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$articles = trim($input['articles'] ?? '');
$image = trim($input['image'] ?? '');
$questions = $input['questions'] ?? [];

if (empty($id) || empty($title) || empty($description)) {
    http_response_code(400);
    echo json_encode(['message' => 'Faltan campos obligatorios para guardar la evaluación']);
    exit;
}

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    // 1. Guardar o actualizar el procedimiento
    $stmt = $pdo->prepare("
        INSERT INTO procedures (id, title, description, articles, image)
        VALUES (:id, :title, :description, :articles, :image)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            description = VALUES(description),
            articles = VALUES(articles),
            image = VALUES(image)
    ");
    
    $stmt->execute([
        'id' => $id,
        'title' => $title,
        'description' => $description,
        'articles' => $articles,
        'image' => $image
    ]);

    // 2. Limpiar preguntas anteriores (Clave foránea en cascada limpiará las opciones)
    $stmtDel = $pdo->prepare("DELETE FROM questions WHERE procedure_id = :id");
    $stmtDel->execute(['id' => $id]);

    // 3. Insertar las nuevas preguntas y opciones
    $stmtQuest = $pdo->prepare("INSERT INTO questions (procedure_id, question_text, explanation) VALUES (:proc_id, :qtext, :exp)");
    $stmtOpt = $pdo->prepare("INSERT INTO question_options (question_id, option_text, is_correct) VALUES (:qid, :otext, :is_correct)");

    foreach ($questions as $q) {
        $qText = trim($q['question'] ?? $q['question_text'] ?? '');
        $qExp = trim($q['explanation'] ?? '');
        $correctIndex = isset($q['answer']) ? (int)$q['answer'] : 0;
        $optionsList = $q['options'] ?? [];

        if (empty($qText)) {
            continue;
        }

        // Insertar pregunta
        $stmtQuest->execute([
            'proc_id' => $id,
            'qtext' => $qText,
            'exp' => $qExp
        ]);
        
        $questionId = $pdo->lastInsertId();

        // Insertar opciones
        foreach ($optionsList as $optIdx => $opt) {
            // Manejar si la opción viene como objeto o string simple
            $optText = is_array($opt) ? ($opt['option_text'] ?? '') : (string)$opt;
            
            // Si la opción viene como objeto con is_correct, respetarlo, de lo contrario usar correctIndex
            $isCorrect = is_array($opt) 
                ? (!empty($opt['is_correct']) ? 1 : 0)
                : ($optIdx === $correctIndex ? 1 : 0);

            $stmtOpt->execute([
                'qid' => $questionId,
                'otext' => $optText,
                'is_correct' => $isCorrect
            ]);
        }
    }

    $pdo->commit();

    http_response_code(200);
    echo json_encode(['message' => 'Evaluación guardada exitosamente en la base de datos', 'id' => $id]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['message' => 'Error de base de datos al guardar la evaluación', 'error' => $e->getMessage()]);
}
