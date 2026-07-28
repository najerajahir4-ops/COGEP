<?php
/**
 * Endpoint: GET /api/auth/oauth-config
 * Retorna las configuraciones públicas de OAuth (Client IDs).
 */

require_once __DIR__ . '/../../middleware/cors.php';
handleCors();

// Cargar variables de entorno cargando el mail_helper
require_once __DIR__ . '/../../config/mail_helper.php';

header('Content-Type: application/json');

echo json_encode([
    'google_client_id' => getenv('GOOGLE_CLIENT_ID') ?: '',
    'microsoft_client_id' => getenv('MICROSOFT_CLIENT_ID') ?: ''
]);
