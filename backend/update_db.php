<?php
/**
 * Script automatizado para recrear la base de datos MySQL con el nuevo esquema,
 * resembrar los datos iniciales de roles, evaluaciones estándar y administrador,
 * y sembrar todas las preguntas y opciones predeterminadas desde data.js.
 */
require_once __DIR__ . '/config/db.php';

try {
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
    
    $pdo = new PDO("mysql:host={$host};port={$port}", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Leer el archivo init-db.sql
    $sql = file_get_contents(__DIR__ . '/init-db.sql');
    
    // Ejecutar el SQL de estructura
    $pdo->exec($sql);
    echo "Base de datos recreada y estructurada exitosamente.\n";
    
    // Leer el archivo insert_questions.sql si existe
    $questionsSqlPath = __DIR__ . '/insert_questions.sql';
    if (file_exists($questionsSqlPath)) {
        $questionsSql = file_get_contents($questionsSqlPath);
        $pdo->exec($questionsSql);
        echo "Preguntas y opciones predeterminadas sembradas exitosamente.\n";
    }
    
    // Ejecutar la siembra del usuario administrador
    require_once __DIR__ . '/seed_admin.php';
} catch (Exception $e) {
    echo "Error al actualizar la base de datos: " . $e->getMessage() . "\n";
}
