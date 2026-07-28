CREATE DATABASE IF NOT EXISTS cogep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cogep_db;

-- 1. Tabla de roles (Mantiene roles de usuario: estudiante, docente, administrador)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 2. Tabla de usuarios (Datos de inicio de sesión y asignación de roles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    verification_code VARCHAR(255) NULL,
    verification_expires DATETIME NULL,
    verification_attempts INT DEFAULT 0,
    last_code_sent_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Tabla de evaluaciones / procedimientos (Nueva tabla para admitir evaluaciones dinámicas creadas por docentes)
CREATE TABLE IF NOT EXISTS procedures (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    articles VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Tabla de preguntas (Vinculada a la tabla de procedimientos/evaluaciones mediante clave foránea en cascada)
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabla de opciones de preguntas (Opciones de opción múltiple vinculadas a sus preguntas correspondientes)
CREATE TABLE IF NOT EXISTS question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabla de intentos de cuestionario (Refleja el puntaje obtenido por los estudiantes en cada evaluación)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    procedure_id VARCHAR(50) NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabla de respuestas del intento (Guarda las respuestas específicas elegidas por el estudiante en su intento)
CREATE TABLE IF NOT EXISTS attempt_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_id INT NULL,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Datos iniciales de Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'administrador', 'Puede administrar usuarios y contenido'),
(2, 'docente', 'Puede gestionar preguntas y ver resultados'),
(3, 'estudiante', 'Puede usar la plataforma y responder cuestionarios')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Datos iniciales de Evaluaciones / Procedimientos estándar
INSERT INTO procedures (id, title, description, articles, image) VALUES
('ordinario', 'Procedimiento Ordinario', 'Evaluación integral del Procedimiento Ordinario según el COGEP, abarcando fases de demanda, citación, audiencia preliminar y de juicio.', 'Arts. 289-298', 'images/P_ordinario.png'),
('ejecutivo', 'Procedimiento Ejecutivo', 'Evaluación del Procedimiento Ejecutivo: títulos ejecutivos, excepciones permitidas, mandamiento de pago y fases de ejecución especial.', 'Arts. 347-355', 'images/P_ejecutivo.png'),
('sumario', 'Procedimiento Sumario', 'Evaluación del Procedimiento Sumario: plazos para contestar la demanda, excepciones, audiencia única y materias aplicables.', 'Arts. 332-333', 'images/P_sumario.png'),
('monitorio', 'Procedimiento Monitorio', 'Evaluación del Procedimiento Monitorio: origen de la deuda, requisitos de procedencia, mandamiento de pago, oposición y ejecución.', 'Arts. 356-361', 'images/P_monitorio.png'),
('ejecucion', 'Procedimiento de Ejecución', 'Evaluación del Procedimiento de Ejecución: títulos de ejecución, mandamiento, embargo de bienes, avalúo, remate de bienes y adjudicación.', 'Arts. 362-413', 'images/P_ejecucion.png')
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), articles = VALUES(articles), image = VALUES(image);

-- Usuario Administrador Inicial
INSERT INTO users (id, role_id, name, email, password_hash) VALUES
(1, 1, 'Administrador', 'admin@cogep.edu.ec', '$2y$10$rkz5ezsWXimn8VHufE78luwbcac6psmbAhIoRvyYDdDI5w8fFm3HK')
ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash);
