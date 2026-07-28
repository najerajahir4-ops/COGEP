<?php
/**
 * Script de migración para agregar campos de disponibilidad, periodos y actualizar imagen
 * en la tabla `procedures` de `cogep_db`.
 */

require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();
    echo "Conexión a la base de datos establecida correctamente.\n";

    // 1. Modificar columna image a MEDIUMTEXT para almacenar Base64
    $pdo->exec("ALTER TABLE procedures MODIFY COLUMN image MEDIUMTEXT NULL");
    echo "Columna 'image' modificada a MEDIUMTEXT para almacenar Base64.\n";

    // 2. Agregar columna availability
    $stmt = $pdo->query("SHOW COLUMNS FROM procedures LIKE 'availability'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE procedures ADD COLUMN availability VARCHAR(50) NOT NULL DEFAULT 'always_open'");
        echo "Columna 'availability' agregada.\n";
    } else {
        echo "Columna 'availability' ya existe.\n";
    }

    // 3. Agregar columna open_at
    $stmt = $pdo->query("SHOW COLUMNS FROM procedures LIKE 'open_at'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE procedures ADD COLUMN open_at DATETIME NULL DEFAULT NULL");
        echo "Columna 'open_at' agregada.\n";
    } else {
        echo "Columna 'open_at' ya existe.\n";
    }

    // 4. Agregar columna period
    $stmt = $pdo->query("SHOW COLUMNS FROM procedures LIKE 'period'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE procedures ADD COLUMN period VARCHAR(50) NULL DEFAULT NULL");
        echo "Columna 'period' agregada.\n";
    } else {
        echo "Columna 'period' ya existe.\n";
    }

    // Actualizar las evaluaciones iniciales a periodo '2026_01' por defecto para que tengan consistencia
    $pdo->exec("UPDATE procedures SET period = '2026_01' WHERE period IS NULL");
    echo "Establecido periodo por defecto '2026_01' a las evaluaciones existentes.\n";

    echo "Migración de base de datos finalizada exitosamente.\n";
} catch (Exception $e) {
    echo "Error durante la migración: " . $e->getMessage() . "\n";
}
