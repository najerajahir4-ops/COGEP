<?php
/**
 * Script de migración para agregar las columnas de verificación de correo a la tabla `users`.
 */

require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();
    echo "Conexión a la base de datos establecida correctamente.\n";

    // 1. Agregar is_verified
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'is_verified'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0");
        echo "Columna 'is_verified' agregada.\n";
    } else {
        echo "Columna 'is_verified' ya existe.\n";
    }

    // 2. Agregar verification_code
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'verification_code'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN verification_code VARCHAR(255) NULL");
        echo "Columna 'verification_code' agregada.\n";
    } else {
        // Asegurar que la longitud sea de 255 para soportar hashes
        $pdo->exec("ALTER TABLE users MODIFY COLUMN verification_code VARCHAR(255) NULL");
        echo "Columna 'verification_code' ya existe (longitud ajustada a 255).\n";
    }

    // 3. Agregar verification_expires
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'verification_expires'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN verification_expires DATETIME NULL");
        echo "Columna 'verification_expires' agregada.\n";
    } else {
        echo "Columna 'verification_expires' ya existe.\n";
    }

    // 4. Agregar verification_attempts
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'verification_attempts'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN verification_attempts INT DEFAULT 0");
        echo "Columna 'verification_attempts' agregada.\n";
    } else {
        echo "Columna 'verification_attempts' ya existe.\n";
    }

    // 5. Agregar last_code_sent_at
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'last_code_sent_at'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN last_code_sent_at DATETIME NULL");
        echo "Columna 'last_code_sent_at' agregada.\n";
    } else {
        echo "Columna 'last_code_sent_at' ya existe.\n";
    }

    // 6. Agregar reset_code
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'reset_code'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN reset_code VARCHAR(255) NULL");
        echo "Columna 'reset_code' agregada.\n";
    } else {
        echo "Columna 'reset_code' ya existe.\n";
    }

    // 7. Agregar reset_expires
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'reset_expires'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN reset_expires DATETIME NULL");
        echo "Columna 'reset_expires' agregada.\n";
    } else {
        echo "Columna 'reset_expires' ya existe.\n";
    }

    echo "Migración completada exitosamente.\n";
} catch (Exception $e) {
    echo "Error durante la migración: " . $e->getMessage() . "\n";
}
