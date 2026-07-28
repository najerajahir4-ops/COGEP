<?php
/**
 * Middleware para la verificación de autenticación y roles mediante Tokens.
 */

require_once __DIR__ . '/../config/db.php';

if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$name] = $value;
            }
        }
        return $headers;
    }
}

// Leer la clave secreta desde las variables de entorno para mayor seguridad
define('SECRET_KEY', getenv('JWT_SECRET') ?: 'cogep_secret_key_2026_super_secure');

function generateToken($user) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role_name'] ?? $user['role'] ?? 'estudiante',
        'role_id' => (int)($user['role_id'] ?? 3),
        'exp' => time() + (86400 * 7) // 7 días
    ]));
    
    $signature = hash_hmac('sha256', "$header.$payload", SECRET_KEY);
    return "$header.$payload.$signature";
}

function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    
    list($header, $payload, $signature) = $parts;
    $validSignature = hash_hmac('sha256', "$header.$payload", SECRET_KEY);
    
    if (!hash_equals($validSignature, $signature)) {
        return null;
    }
    
    $data = json_decode(base64_decode($payload), true);
    if (!$data || (isset($data['exp']) && $data['exp'] < time())) {
        return null;
    }
    
    return $data;
}

function getAuthenticatedUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (!preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        return null;
    }

    $token = $matches[1];
    return verifyToken($token);
}

function requireAuth() {
    $user = getAuthenticatedUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado', 'message' => 'Token inválido o expirado']);
        exit;
    }
    return $user;
}

function requireRole($allowedRoles = []) {
    $user = requireAuth();
    if (!in_array($user['role'], $allowedRoles, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso prohibido', 'message' => 'No tienes permisos para esta acción']);
        exit;
    }
    return $user;
}
