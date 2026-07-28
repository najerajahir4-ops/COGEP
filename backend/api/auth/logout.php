<?php
/**
 * Endpoint: POST /api/auth/logout (o /api/auth/logout.php)
 * Cierra la sesión activa del usuario.
 */

require_once __DIR__ . '/../../middleware/cors.php';

handleCors();

http_response_code(200);
echo json_encode(['message' => 'Sesión cerrada exitosamente']);
