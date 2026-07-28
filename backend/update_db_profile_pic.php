<?php
/**
 * Script de migración para agregar el campo `avatar` (MEDIUMTEXT)
 * en la tabla `users` para el almacenamiento de fotos de perfil en Base64.
 */

require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();
    echo "Conexión a la base de datos establecida correctamente.\n";

    // Verificar si la columna avatar ya existe
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'avatar'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN avatar MEDIUMTEXT NULL");
        echo "Columna 'avatar' agregada exitosamente a la tabla 'users'.\n";
    } else {
        echo "Columna 'avatar' ya existe en la tabla 'users'.\n";
    }

    echo "Migración de base de datos finalizada con éxito.\n";
} catch (Exception $e) {
    echo "Error durante la migración: " . $e->getMessage() . "\n";
}
