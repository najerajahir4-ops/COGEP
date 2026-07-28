<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();
    
    // Asegurar que existan los roles
    $pdo->exec("
        INSERT INTO roles (id, name, description) VALUES
        (1, 'administrador', 'Puede administrar usuarios y contenido'),
        (2, 'docente', 'Puede gestionar preguntas y ver resultados'),
        (3, 'estudiante', 'Puede usar la plataforma y responder cuestionarios')
        ON DUPLICATE KEY UPDATE description = VALUES(description)
    ");

    $hash = password_hash('Admin@321', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("
        INSERT INTO users (role_id, name, email, password_hash) 
        VALUES (1, 'Administrador', 'admin@cogep.edu.ec', :hash)
        ON DUPLICATE KEY UPDATE name = 'Administrador', role_id = 1, password_hash = :hash2
    ");
    $stmt->execute(['hash' => $hash, 'hash2' => $hash]);

    echo "Usuario administrador creado o actualizado exitosamente.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

