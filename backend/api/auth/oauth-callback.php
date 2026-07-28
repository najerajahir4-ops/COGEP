<?php
/**
 * Callback de OAuth para recibir el código de Google y Microsoft,
 * intercambiarlo por un token de acceso y autenticar/registrar al usuario.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Cargar variables de entorno cargando el mail_helper
require_once __DIR__ . '/../../config/mail_helper.php';

$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? ''; // Determina el proveedor ('google' o 'microsoft')

$errorMsg = '';
$token = '';
$userData = null;

if (empty($code) || empty($state)) {
    $errorMsg = 'Código de autorización o estado no recibidos.';
} else {
    // Reconstruir la redirect_uri exacta para que coincida con la que envió el JS
    $isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
               (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    $protocol = $isHttps ? 'https' : 'http';
    $redirectUri = $protocol . '://' . $_SERVER['HTTP_HOST'] . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($state === 'google') {
        $clientId = getenv('GOOGLE_CLIENT_ID');
        $clientSecret = getenv('GOOGLE_CLIENT_SECRET');

        if (empty($clientId) || empty($clientSecret)) {
            $errorMsg = 'Las credenciales de Google OAuth no están configuradas en el archivo .env del servidor.';
        } else {
            // 1. Intercambiar código por token de acceso
            $postData = http_build_query([
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => $redirectUri,
                'grant_type' => 'authorization_code'
            ]);

            $opts = [
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                    'content' => $postData,
                    'ignore_errors' => true
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ];
            $context = stream_context_create($opts);
            $tokenRes = @file_get_contents('https://oauth2.googleapis.com/token', false, $context);
            $tokenData = json_decode($tokenRes, true);

            if (!isset($tokenData['access_token'])) {
                $errorMsg = 'Error de Google Token: ' . ($tokenData['error_description'] ?? 'Respuesta inválida del servidor de Google.');
            } else {
                // 2. Obtener información de perfil del usuario
                $profileOpts = [
                    'http' => [
                        'method' => 'GET',
                        'header' => "Authorization: Bearer " . $tokenData['access_token'] . "\r\n",
                        'ignore_errors' => true
                    ],
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false
                    ]
                ];
                $profileContext = stream_context_create($profileOpts);
                $profileRes = @file_get_contents('https://www.googleapis.com/oauth2/v2/userinfo', false, $profileContext);
                $profile = json_decode($profileRes, true);

                $email = isset($profile['email']) ? trim(strtolower($profile['email'])) : '';
                $name = isset($profile['name']) ? trim($profile['name']) : '';

                if (empty($email)) {
                    $errorMsg = 'No se pudo obtener el correo electrónico del perfil de Google.';
                }
            }
        }
    } elseif ($state === 'microsoft') {
        $clientId = getenv('MICROSOFT_CLIENT_ID');
        $clientSecret = getenv('MICROSOFT_CLIENT_SECRET');

        if (empty($clientId) || empty($clientSecret)) {
            $errorMsg = 'Las credenciales de Microsoft OAuth no están configuradas en el archivo .env del servidor.';
        } else {
            // 1. Intercambiar código por token de acceso
            $postData = http_build_query([
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => $redirectUri,
                'grant_type' => 'authorization_code',
                'scope' => 'openid profile email User.Read'
            ]);

            $opts = [
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                    'content' => $postData,
                    'ignore_errors' => true
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ];
            $context = stream_context_create($opts);
            $tokenRes = @file_get_contents('https://login.microsoftonline.com/common/oauth2/v2.0/token', false, $context);
            $tokenData = json_decode($tokenRes, true);

            if (!isset($tokenData['access_token'])) {
                $errorMsg = 'Error de Microsoft Token: ' . ($tokenData['error_description'] ?? 'Respuesta inválida del servidor de Microsoft.');
            } else {
                // 2. Obtener información de perfil usando Microsoft Graph
                $profileOpts = [
                    'http' => [
                        'method' => 'GET',
                        'header' => "Authorization: Bearer " . $tokenData['access_token'] . "\r\n",
                        'ignore_errors' => true
                    ],
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false
                    ]
                ];
                $profileContext = stream_context_create($profileOpts);
                $profileRes = @file_get_contents('https://graph.microsoft.com/v1.0/me', false, $profileContext);
                $profile = json_decode($profileRes, true);

                $email = isset($profile['mail']) ? $profile['mail'] : (isset($profile['userPrincipalName']) ? $profile['userPrincipalName'] : '');
                $email = trim(strtolower($email));
                $name = isset($profile['displayName']) ? trim($profile['displayName']) : '';

                if (empty($email)) {
                    $errorMsg = 'No se pudo obtener el correo electrónico del perfil de Microsoft.';
                }
            }
        }
    } else {
        $errorMsg = 'Proveedor de autenticación desconocido.';
    }
}

// Procesar inicio de sesión o registro si no hay errores
if (empty($errorMsg) && !empty($email)) {
    try {
        $pdo = getDBConnection();
        
        // Buscar si el usuario ya existe
        $stmt = $pdo->prepare("
            SELECT u.id, u.name, u.email, u.role_id, u.is_verified, r.name AS role_name 
            FROM users u 
            INNER JOIN roles r ON u.role_id = r.id 
            WHERE u.email = :email
        ");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user) {
            // Verificar cuenta si no lo estaba
            if ((int)$user['is_verified'] === 0) {
                $updateStmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE id = :id");
                $updateStmt->execute(['id' => $user['id']]);
                $user['is_verified'] = 1;
            }

            $userData = [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role_name'],
                'role_id' => (int)$user['role_id']
            ];
        } else {
            // Registrar nuevo usuario (rol de estudiante por defecto = 3)
            $roleId = 3;
            $roleName = 'estudiante';
            
            // Si el nombre viene vacío, derivarlo del correo
            if (empty($name)) {
                $name = explode('@', $email)[0];
                $name = ucwords(str_replace(['.', '-', '_'], ' ', $name));
            }

            // Contraseña aleatoria segura
            $randomPassword = bin2hex(random_bytes(16));
            $passwordHash = password_hash($randomPassword, PASSWORD_BCRYPT);

            $insertStmt = $pdo->prepare("
                INSERT INTO users (role_id, name, email, password_hash, is_verified, verification_attempts) 
                VALUES (:role_id, :name, :email, :password_hash, 1, 0)
            ");
            $insertStmt->execute([
                'role_id' => $roleId,
                'name' => $name,
                'email' => $email,
                'password_hash' => $passwordHash
            ]);

            $newUserId = $pdo->lastInsertId();

            $userData = [
                'id' => (int)$newUserId,
                'name' => $name,
                'email' => $email,
                'role' => $roleName,
                'role_id' => $roleId
            ];
        }

        $token = generateToken($userData);

    } catch (PDOException $e) {
        $errorMsg = 'Error al consultar la base de datos: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Autenticando...</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #1b1b1b;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.1);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border-left-color: #0078d4;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div>
        <div class="spinner"></div>
        <p><?php echo empty($errorMsg) ? 'Autenticación exitosa. Redirigiendo...' : 'Error de autenticación.'; ?></p>
    </div>
    
    <script>
        // Enviar resultado a la ventana principal
        <?php if (empty($errorMsg) && !empty($token)): ?>
            window.opener.postMessage({
                status: 'success',
                token: '<?php echo $token; ?>',
                user: <?php echo json_encode($userData); ?>
            }, window.location.origin);
        <?php else: ?>
            window.opener.postMessage({
                status: 'error',
                message: '<?php echo addslashes($errorMsg ?: "Error de comunicación con el proveedor."); ?>'
            }, window.location.origin);
        <?php endif; ?>
        
        // Cerrar ventana emergente
        window.close();
    </script>
</body>
</html>
