<?php
/**
 * Helper para el envío de correos electrónicos vía SMTP con fallback a log local.
 */

function loadEnv() {
    $envPath = dirname(__DIR__) . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value);
                // Si está entre comillas, quitarlas
                if (preg_match('/^"(.*)"$/', $value, $matches)) {
                    $value = $matches[1];
                }
                putenv("$name=$value");
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Cargar variables de entorno al incluir el archivo
loadEnv();

function writeMailLog($logContent) {
    $logPath = dirname(__DIR__) . '/sent_emails.log';
    if (@file_put_contents($logPath, $logContent, FILE_APPEND) === false) {
        error_log("MAIL_LOG:\n" . trim($logContent));
    }
}

function sendVerificationEmail($toEmail, $toName, $code) {
    $host = getenv('SMTP_HOST') ?: 'sandbox.smtp.mailtrap.io';
    $port = getenv('SMTP_PORT') ?: 2525;
    $user = getenv('SMTP_USER') ?: '';
    $pass = getenv('SMTP_PASS') ?: '';

    $subject = "Verifica tu cuenta - COGEP Interactivo";
    $body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #F8C8DC; border-radius: 10px; background-color: #FFF0F5; color: #5A404C;'>
        <h2 style='color: #5A404C; text-align: center; border-bottom: 2px solid #F8C8DC; padding-bottom: 10px;'>Verificación de Correo Electrónico</h2>
        <p>Hola <strong>" . htmlspecialchars($toName) . "</strong>,</p>
        <p>Gracias por registrarte en nuestra plataforma de Aprendizaje y Simulación Procesal del COGEP.</p>
        <p>Para activar tu cuenta, utiliza el siguiente código de verificación de 6 dígitos:</p>
        <div style='text-align: center; margin: 30px 0;'>
            <span style='font-size: 2.5rem; font-weight: bold; letter-spacing: 5px; background-color: #F8C8DC; color: #5A404C; padding: 15px 30px; border-radius: 5px; border: 1px solid #5A404C; display: inline-block;'>" . htmlspecialchars($code) . "</span>
        </div>
        <p style='font-size: 0.9rem; color: #5A404C;'>Este código es válido por 24 horas. Si no solicitaste este registro, por favor ignora este correo.</p>
        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #F8C8DC; font-size: 0.8rem; text-align: center; color: #8C707C;'>
            &copy; 2026 Portal COGEP Interactivo. Todos los derechos reservados.
        </div>
    </div>";

    // Si no hay credenciales SMTP configuradas, simular guardando el correo en un archivo de log
    if (empty($user) || empty($pass)) {
        $logContent = "=== NUEVO CORREO ENVIADO ===\n";
        $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "Para: $toName <$toEmail>\n";
        $logContent .= "Asunto: $subject\n";
        $logContent .= "Codigo de Verificacion: $code\n";
        $logContent .= "=========================\n\n";
        writeMailLog($logContent);
        return true;
    }

    // Envío SMTP real por Sockets
    $ssl = ($port == 465) ? 'ssl://' : '';
    $socket = @fsockopen($ssl . $host, $port, $errno, $errstr, 10);
    
    if (!$socket) {
        // Fallback: guardar en log si falla la conexión socket
        $logContent = "=== NUEVO CORREO (FALLO CONEXION SMTP, GUARDADO EN LOG) ===\n";
        $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "Para: $toName <$toEmail>\n";
        $logContent .= "Asunto: $subject\n";
        $logContent .= "Codigo de Verificacion: $code\n";
        $logContent .= "Error SMTP ($errno): $errstr\n";
        $logContent .= "=========================\n\n";
        writeMailLog($logContent);
        return true;
    }

    $readResponse = function($socket) {
        $response = "";
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == " ") { break; }
        }
        return $response;
    };

    $readResponse($socket);

    fwrite($socket, "EHLO localhost\r\n");
    $readResponse($socket);

    // Si el puerto es 587, iniciar negociación TLS (STARTTLS)
    if ($port == 587) {
        fwrite($socket, "STARTTLS\r\n");
        $res = $readResponse($socket);
        if (strpos($res, '220') === 0) {
            // Actualizar el socket a TLS
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $logContent = "=== NUEVO CORREO (FALLO TLS HANDSHAKE, GUARDADO EN LOG) ===\n";
                $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
                $logContent .= "Para: $toName <$toEmail>\n";
                $logContent .= "Asunto: $subject\n";
                $logContent .= "Codigo de Verificacion: $code\n";
                $logContent .= "=========================\n\n";
                writeMailLog($logContent);
                fclose($socket);
                return true;
            }
            // Re-enviar EHLO sobre el canal seguro
            fwrite($socket, "EHLO localhost\r\n");
            $readResponse($socket);
        }
    }

    fwrite($socket, "AUTH LOGIN\r\n");
    $readResponse($socket);

    fwrite($socket, base64_encode($user) . "\r\n");
    $readResponse($socket);

    fwrite($socket, base64_encode($pass) . "\r\n");
    $readResponse($socket);

    fwrite($socket, "MAIL FROM: <$user>\r\n");
    $readResponse($socket);

    fwrite($socket, "RCPT TO: <$toEmail>\r\n");
    $readResponse($socket);

    fwrite($socket, "DATA\r\n");
    $readResponse($socket);

    // Codificar asunto y nombres para cumplir estrictamente con RFC 2047 y evitar filtros de spam institucionales
    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $encodedFromName = "=?UTF-8?B?" . base64_encode("COGEP Interactivo") . "?=";
    $encodedToName = "=?UTF-8?B?" . base64_encode($toName) . "?=";
    
    // Generar Message-ID único y cabecera Date válidas para pasar filtros de Office 365/Outlook
    $messageId = sprintf(
        "<%s.%s@%s>",
        bin2hex(random_bytes(8)),
        bin2hex(random_bytes(8)),
        $_SERVER['HTTP_HOST'] ?? 'localhost'
    );
    $rfcDate = date('r');

    $headers = "From: $encodedFromName <$user>\r\n";
    $headers .= "Reply-To: COGEP Interactivo <$user>\r\n";
    $headers .= "To: $encodedToName <$toEmail>\r\n";
    $headers .= "Subject: $encodedSubject\r\n";
    $headers .= "Date: $rfcDate\r\n";
    $headers .= "Message-ID: $messageId\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Normalizar saltos de línea a CRLF (\r\n) para evitar filtros por Bare Line Feeds
    $normalizedBody = str_replace("\r\n", "\n", $body);
    $normalizedBody = str_replace("\n", "\r\n", $normalizedBody);

    fwrite($socket, $headers . "\r\n" . $normalizedBody . "\r\n.\r\n");
    $readResponse($socket);

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}

function sendRecoveryEmail($toEmail, $toName, $code) {
    $host = getenv('SMTP_HOST') ?: 'sandbox.smtp.mailtrap.io';
    $port = getenv('SMTP_PORT') ?: 2525;
    $user = getenv('SMTP_USER') ?: '';
    $pass = getenv('SMTP_PASS') ?: '';

    $subject = "Recuperación de contraseña - COGEP Interactivo";
    $body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid rgba(86, 28, 36, 0.2); border-radius: 10px; background-color: #FFF8F8; color: #561C24;'>
        <h2 style='color: #561C24; text-align: center; border-bottom: 2px solid rgba(86, 28, 36, 0.2); padding-bottom: 10px;'>Recuperación de Contraseña</h2>
        <p>Hola <strong>" . htmlspecialchars($toName) . "</strong>,</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el Portal COGEP Interactivo.</p>
        <p>Para continuar con el restablecimiento de tu contraseña, utiliza el siguiente código de 6 dígitos:</p>
        <div style='text-align: center; margin: 30px 0;'>
            <span style='font-size: 2.5rem; font-weight: bold; letter-spacing: 5px; background-color: #561C24; color: #FFFFFF; padding: 15px 30px; border-radius: 5px; display: inline-block;'>" . htmlspecialchars($code) . "</span>
        </div>
        <p style='font-size: 0.9rem; color: #6D2932;'>Este código es válido por 1 hora. Si tú no solicitaste este cambio, puedes ignorar este correo y tu contraseña actual seguirá funcionando de manera segura.</p>
        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(86, 28, 36, 0.2); font-size: 0.8rem; text-align: center; color: #6D2932;'>
            &copy; 2026 Portal COGEP Interactivo. Todos los derechos reservados.
        </div>
    </div>";

    // Simulación en log si no hay SMTP
    if (empty($user) || empty($pass)) {
        $logContent = "=== NUEVO CORREO (RECUPERACION CONTRASEÑA) ===\n";
        $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "Para: $toName <$toEmail>\n";
        $logContent .= "Asunto: $subject\n";
        $logContent .= "Codigo de Recuperacion: $code\n";
        $logContent .= "=========================\n\n";
        writeMailLog($logContent);
        return true;
    }

    $ssl = ($port == 465) ? 'ssl://' : '';
    $socket = @fsockopen($ssl . $host, $port, $errno, $errstr, 10);
    
    if (!$socket) {
        $logContent = "=== NUEVO CORREO (FALLO CONEXION RECOVERY SMTP, GUARDADO EN LOG) ===\n";
        $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "Para: $toName <$toEmail>\n";
        $logContent .= "Asunto: $subject\n";
        $logContent .= "Codigo de Recuperacion: $code\n";
        $logContent .= "Error SMTP ($errno): $errstr\n";
        $logContent .= "=========================\n\n";
        writeMailLog($logContent);
        return true;
    }

    $readResponse = function($socket) {
        $response = "";
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == " ") { break; }
        }
        return $response;
    };

    $readResponse($socket);

    fwrite($socket, "EHLO localhost\r\n");
    $readResponse($socket);

    if ($port == 587) {
        fwrite($socket, "STARTTLS\r\n");
        $res = $readResponse($socket);
        if (strpos($res, '220') === 0) {
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $logContent = "=== NUEVO CORREO (FALLO TLS HANDSHAKE RECOVERY, LOGGED) ===\n";
                $logContent .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
                $logContent .= "Para: $toName <$toEmail>\n";
                $logContent .= "Asunto: $subject\n";
                $logContent .= "Codigo de Recuperacion: $code\n";
                $logContent .= "=========================\n\n";
                writeMailLog($logContent);
                fclose($socket);
                return true;
            }
            fwrite($socket, "EHLO localhost\r\n");
            $readResponse($socket);
        }
    }

    fwrite($socket, "AUTH LOGIN\r\n");
    $readResponse($socket);

    fwrite($socket, base64_encode($user) . "\r\n");
    $readResponse($socket);

    fwrite($socket, base64_encode($pass) . "\r\n");
    $readResponse($socket);

    fwrite($socket, "MAIL FROM: <$user>\r\n");
    $readResponse($socket);

    fwrite($socket, "RCPT TO: <$toEmail>\r\n");
    $readResponse($socket);

    fwrite($socket, "DATA\r\n");
    $readResponse($socket);

    // Codificar asunto y nombres para cumplir estrictamente con RFC 2047 y evitar filtros de spam institucionales
    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $encodedFromName = "=?UTF-8?B?" . base64_encode("COGEP Interactivo") . "?=";
    $encodedToName = "=?UTF-8?B?" . base64_encode($toName) . "?=";
    
    // Generar Message-ID único y cabecera Date válidas para pasar filtros de Office 365/Outlook
    $messageId = sprintf(
        "<%s.%s@%s>",
        bin2hex(random_bytes(8)),
        bin2hex(random_bytes(8)),
        $_SERVER['HTTP_HOST'] ?? 'localhost'
    );
    $rfcDate = date('r');

    $headers = "From: $encodedFromName <$user>\r\n";
    $headers .= "Reply-To: COGEP Interactivo <$user>\r\n";
    $headers .= "To: $encodedToName <$toEmail>\r\n";
    $headers .= "Subject: $encodedSubject\r\n";
    $headers .= "Date: $rfcDate\r\n";
    $headers .= "Message-ID: $messageId\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Normalizar saltos de línea a CRLF (\r\n) para evitar filtros por Bare Line Feeds
    $normalizedBody = str_replace("\r\n", "\n", $body);
    $normalizedBody = str_replace("\n", "\r\n", $normalizedBody);

    fwrite($socket, $headers . "\r\n" . $normalizedBody . "\r\n.\r\n");
    $readResponse($socket);

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}
