<?php
/**
 * Router principal para el servidor embebido de PHP o Apache en WampServer.
 * Soporta tanto http://localhost/Des. Proyecto/ como http://localhost:5000/
 */

$rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = urldecode($rawUri);

$root = dirname(__DIR__);
$fileUri = $uri === '/' ? '/index.html' : $uri;

// Si es un archivo físico existente (CSS, JS, imágenes, etc.) en la raíz, servir directamente
if (file_exists($root . $fileUri) && !is_dir($root . $fileUri)) {
    return false;
}

// Limpiar prefijos de subcarpeta para WampServer y Apache
$path = preg_replace('#^/Des\.\s*Proyecto/backend/router\.php#i', '', $uri);
$path = preg_replace('#^/Des\.\s*Proyecto/backend#i', '', $path);
$path = preg_replace('#^/backend/router\.php#i', '', $path);
$path = preg_replace('#^/backend#i', '', $path);

// Mapeo de rutas dinámicas a archivos PHP
if ($path === '/api/auth/register' || $path === '/api/auth/register.php') {
    require __DIR__ . '/api/auth/register.php';
    exit;
}
if ($path === '/api/auth/login' || $path === '/api/auth/login.php') {
    require __DIR__ . '/api/auth/login.php';
    exit;
}
if ($path === '/api/auth/me' || $path === '/api/auth/me.php') {
    require __DIR__ . '/api/auth/me.php';
    exit;
}
if ($path === '/api/auth/logout' || $path === '/api/auth/logout.php') {
    require __DIR__ . '/api/auth/logout.php';
    exit;
}
if ($path === '/api/auth/verify' || $path === '/api/auth/verify.php') {
    require __DIR__ . '/api/auth/verify.php';
    exit;
}
if ($path === '/api/auth/resend' || $path === '/api/auth/resend.php') {
    require __DIR__ . '/api/auth/resend.php';
    exit;
}
if ($path === '/api/migrate-db') {
    require __DIR__ . '/update_db_improvements.php';
    require __DIR__ . '/update_db_profile_pic.php';
    echo json_encode(["status" => "Migracion completada"]);
    exit;
}

if ($path === '/api/auth/forgot-password' || $path === '/api/auth/forgot-password.php') {
    require __DIR__ . '/api/auth/forgot-password.php';
    exit;
}
if ($path === '/api/auth/reset-password' || $path === '/api/auth/reset-password.php') {
    require __DIR__ . '/api/auth/reset-password.php';
    exit;
}
if ($path === '/api/auth/oauth-config' || $path === '/api/auth/oauth-config.php') {
    require __DIR__ . '/api/auth/oauth-config.php';
    exit;
}
if ($path === '/api/auth/oauth-callback' || $path === '/api/auth/oauth-callback.php') {
    require __DIR__ . '/api/auth/oauth-callback.php';
    exit;
}

if ($path === '/api/users/update-avatar' || $path === '/api/users/update_avatar.php') {
    require __DIR__ . '/api/users/update_avatar.php';
    exit;
}
if ($path === '/api/users' || $path === '/api/users/index.php') {
    require __DIR__ . '/api/users/index.php';
    exit;
}
if (preg_match('#^/api/users/(\d+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/users/detail.php';
    exit;
}

if ($path === '/api/questions' || $path === '/api/questions/index.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require __DIR__ . '/api/questions/create.php';
    } else {
        require __DIR__ . '/api/questions/index.php';
    }
    exit;
}
if (preg_match('#^/api/questions/(\d+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/questions/detail.php';
    exit;
}

if ($path === '/api/attempts/start' || $path === '/api/attempts/start.php') {
    require __DIR__ . '/api/attempts/start.php';
    exit;
}
if (preg_match('#^/api/attempts/(\d+)/submit$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/attempts/submit.php';
    exit;
}
if ($path === '/api/attempts/submit' || $path === '/api/attempts/submit.php') {
    require __DIR__ . '/api/attempts/submit.php';
    exit;
}
if ($path === '/api/attempts/stats' || $path === '/api/attempts/stats.php') {
    require __DIR__ . '/api/attempts/stats.php';
    exit;
}
if ($path === '/api/attempts/my-attempts' || $path === '/api/attempts/my-attempts.php') {
    require __DIR__ . '/api/attempts/my-attempts.php';
    exit;
}

if ($path === '/api/procedures' || $path === '/api/procedures/index.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require __DIR__ . '/api/procedures/save.php';
    } else {
        require __DIR__ . '/api/procedures/index.php';
    }
    exit;
}
if (preg_match('#^/api/procedures/([^/]+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        require __DIR__ . '/api/procedures/delete.php';
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require __DIR__ . '/api/procedures/save.php';
    }
    exit;
}

// Ruta por defecto si no coincide ninguna anterior
http_response_code(404);
header("Content-Type: application/json; charset=UTF-8");
echo json_encode([
    'error' => 'Ruta no encontrada en la API de PHP',
    'path' => $path,
    'raw_uri' => $uri
]);
