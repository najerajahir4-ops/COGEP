# Historial de Cambios y Mejoras - LegisNexus / COGEP Interactivo

Este documento detalla todas las modificaciones, nuevas características y ajustes de seguridad que se han implementado en la plataforma.

---

## 1. Base de Datos (MySQL)

* **Script de Migración (`backend/migrate.php`) [NUEVO]**:
  * Diseñado para actualizar de forma segura y automatizada la tabla `users` sin riesgo de pérdida de datos.
* **Nuevas Columnas de Control de Seguridad**:
  * `is_verified` (TINYINT, default 0): Estado de verificación de la cuenta (0 = No verificado, 1 = Verificado/Activo).
  * `verification_code` (VARCHAR 255): Hash de Bcrypt del código PIN de verificación.
  * `verification_expires` (DATETIME): Fecha y hora límite de validez del código PIN de registro (24 horas).
  * `verification_attempts` (INT, default 0): Contador de intentos fallidos para prevenir ataques de fuerza bruta.
  * `last_code_sent_at` (DATETIME): Marca temporal del último correo enviado para el control de frecuencia (Rate-limiting).
  * `reset_code` (VARCHAR 255): Hash de Bcrypt del código PIN de recuperación de contraseña.
  * `reset_expires` (DATETIME): Fecha y hora límite de validez del código PIN de recuperación (1 hora).

---

## 2. Servidor de Correo (SMTP con Handshake Seguro)

* **Cliente SMTP Sockets (`backend/config/mail_helper.php`) [MODIFICADO]**:
  * Se implementó un cliente SMTP nativo en PHP que soporta:
    * Conexión SSL directa en el puerto **465** (anteponiendo el prefijo `ssl://`).
    * Conexión y actualización segura **STARTTLS** en el puerto **587** (negociación TLS por sockets), garantizando compatibilidad total con servidores modernos de correo como **Gmail**.
  * **Modo de Simulación**: Si no se configuran credenciales SMTP en el `.env`, los correos y códigos de 6 dígitos se guardan de manera automática en el archivo local `backend/sent_emails.log` para desarrollo sin necesidad de internet.
  * **Plantillas de Correo Profesionales**: Diseñados correos HTML responsivos personalizados para verificar cuentas y recuperar contraseñas, usando tipografías limpias y los colores institucionales.

---

## 3. Endpoints del Backend (PHP REST API)

* **Registro (`backend/api/auth/register.php`) [MODIFICADO]**:
  * Bloquea registros de correos que ya están verificados e integrados.
  * Si un correo no verificado intenta registrarse de nuevo, actualiza la contraseña, regenera el código PIN, limpia intentos fallidos y envía el nuevo correo.
* **Inicio de Sesión (`backend/api/auth/login.php`) [MODIFICADO]**:
  * Si las credenciales son válidas pero la cuenta no está verificada (`is_verified = 0`), bloquea el acceso devolviendo un código de estado `403 Forbidden` y el correo asociado.
* **Verificación de Cuenta (`backend/api/auth/verify.php`) [NUEVO]**:
  * Valida el código de 6 dígitos comparando hashes con `password_verify()`.
  * **Límite de Fuerza Bruta**: Incrementa el contador de intentos fallidos. Al quinto error consecutivo, invalida el código de verificación obligando a solicitar uno nuevo.
  * **Expiración**: Verifica que no hayan pasado las 24 horas y retorna un error detallado si expiró.
  * **Autologin**: Al validar con éxito, activa la cuenta y genera de forma automática el token JWT de inicio de sesión.
* **Reenvío de PIN (`backend/api/auth/resend.php`) [NUEVO]**:
  * Genera un nuevo PIN. Limita el reenvío a **1 vez cada 60 segundos** comparando la hora actual con `last_code_sent_at` para evitar abusos y spam.
* **Solicitar Recuperación (`backend/api/auth/forgot-password.php`) [NUEVO]**:
  * Verifica si el correo existe, genera un código temporal de recuperación de 6 dígitos, guarda su hash por 1 hora y lo envía al Gmail del usuario.
* **Restablecer Contraseña (`backend/api/auth/reset-password.php`) [NUEVO]**:
  * Valida el código PIN de recuperación, comprueba la validez temporal (1 hora), actualiza el hash de la nueva contraseña con Bcrypt y limpia los campos temporales de recuperación en la base de datos.
* **Enrutador Central (`backend/router.php`) [MODIFICADO]**:
  * Se registraron todas las nuevas rutas del backend en la API.
  * **Corrección de Archivos Estáticos**: Se configuró el enrutador para que el servidor de desarrollo PHP embebido (`php -S`) sirva correctamente los archivos estáticos (HTML, CSS, JS, etc.) desde la raíz del proyecto y redirija la raíz `/` a `/index.html` automáticamente.

---

## 4. Diseño y Vistas del Frontend (HTML/CSS)

* **Estética Glassmorphism Unificada (`index.html`) [MODIFICADO]**:
  * **Pantalla de Verificación (`#view-verify`)**: Adaptada por completo al tema oscuro, con bordes de cristal semitransparente, iconos dorados, botones guindas/vino del proyecto original, y textos legibles en blanco.
  * **Pantalla de Recuperación (`#view-forgot`) [NUEVA]**: Formulario en el centro para ingresar el correo en caso de haber olvidado la clave.
  * **Pantalla de Cambio de Clave (`#view-reset`) [NUEVA]**: Formulario para ingresar el código recibido y la nueva contraseña (con confirmación).
* **Interruptores de Configuración (`index.html` / `css/styles.css`) [MODIFICADO]**:
  * Se removieron los colores de fondo grises inyectados inline en el HTML de los switches en la pantalla de Ajustes.
  * Añadidas animaciones CSS fluidas en `styles.css` para los interruptores:
    * Estado inactivo: Gris claro (`#ccc`).
    * Estado activo: Se desliza el círculo y cambia a **Azul profesional (`#2563EB`)**.

---

## 5. Lógica del Cliente e Interacciones (JavaScript)

* **Manejador de Sesiones y Navegación (`js/auth.js`) [MODIFICADO]**:
  * Controla la navegación del usuario redirigiéndolo a `#view-verify` en registros exitosos o si intenta iniciar sesión con una cuenta inactiva.
  * Administra el temporizador regresivo de 60 segundos para el botón "Reenviar Código".
  * Detecta parámetros de verificación automáticos en la URL (`#verify?email=...&code=...`) permitiendo que el usuario se valide automáticamente al hacer clic en enlaces directos.
  * Implementa las validaciones de los nuevos formularios de recuperación y cambio de clave (mínimo 8 caracteres, una mayúscula, un número y coincidencia de clave).
  * Activa la visibilidad tipo "ojo" en los campos de contraseña en todas las nuevas pantallas de restablecimiento.
* **Preferencias de Interfaz Aisladas por Usuario (`js/app.js` / `js/auth.js`) [MODIFICADO]**:
  * Se aisló el almacenamiento de las preferencias de la interfaz (como el Tema Oscuro y el Tamaño de Fuente) agregando el correo electrónico del usuario como sufijo en las claves de localStorage.
  * Al cerrar sesión, la interfaz se restablece de forma automática a los valores por defecto (tema claro y tamaño normal).
  * Al iniciar sesión o verificar la cuenta, se cargan y aplican inmediatamente las preferencias personalizadas del usuario que ingresó.
* **Notificaciones Toast no Bloqueantes (`js/auth.js` / `js/app.js`) [MODIFICADO]**:
  * Se programó un **sistema de notificaciones Toast personalizado (`window.Toast`)** con diseño flotante y animaciones fluidas que se deslizan en la parte superior derecha de la pantalla.
  * **Reemplazo de alert() y prompt()**: Se removieron todas las ventanas nativas emergentes y grises del navegador para las alertas de login, registro, restablecimiento, guardado de configuraciones y restricciones de acceso para páginas restringidas (Simulador y Evaluaciones), ofreciendo un flujo de navegación limpio y profesional.
