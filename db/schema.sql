-- MariaDB schema proposal for salon_div_x_div
-- Character set and collation ensure full UTF-8 support
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
-- 1) USUARIO: autenticación y autorización básica
-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
CREATE TABLE `usuario` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `email` varchar(190) NOT NULL,
  `email_verified_at` timestamp(3) NULL DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp(3) NULL DEFAULT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuario_role_active` (`role`,`is_active`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`role` in ('admin','staff'))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
-- 2) SALON: configuración base proveniente de dicc_api_foto.configuracion
-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
CREATE TABLE `salon` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `nombre` varchar(160) DEFAULT NULL,
  `columnas` int(11) NOT NULL,
  `filas` int(11) NOT NULL,
  `family` varchar(60) NOT NULL,
  `configuracion_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `clases_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clases_json`)),
  `rutas_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rutas_json`)),
  `tipos_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_salon_owner` (`usuario_id`,`id`),
  CONSTRAINT `fk_salon_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (json_valid(`configuracion_json`)),
  CONSTRAINT `CONSTRAINT_2` CHECK (`clases_json` is null or json_valid(`clases_json`)),
  CONSTRAINT `CONSTRAINT_3` CHECK (`rutas_json` is null or json_valid(`rutas_json`)),
  CONSTRAINT `CONSTRAINT_4` CHECK (`tipos_json` is null or json_valid(`tipos_json`))
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
-- 3) FOTO: instantáneas históricas del estado del salón
-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
CREATE TABLE `foto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `salon_id` bigint(20) unsigned NOT NULL,
  `titulo` varchar(160) DEFAULT NULL,
  `dicc_reservas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dicc_indices` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dicc_mensajes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dicc_configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `captured_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `es_plantilla` tinyint(1) DEFAULT 0,
  `es_publica` tinyint(1) DEFAULT 0,
  `slug_publico` varchar(190) DEFAULT NULL,
  `mensaje_publico` text DEFAULT NULL,
  `publicada_at` timestamp(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_foto_salon_time` (`salon_id`,`captured_at` DESC),
  KEY `idx_foto_publica` (`es_publica`,`publicada_at` DESC),
  KEY `idx_foto_slug_normal` (`slug_publico`),
  CONSTRAINT `fk_foto_salon` FOREIGN KEY (`salon_id`) REFERENCES `salon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (json_valid(`dicc_reservas`)),
  CONSTRAINT `CONSTRAINT_2` CHECK (json_valid(`dicc_indices`)),
  CONSTRAINT `CONSTRAINT_3` CHECK (json_valid(`dicc_mensajes`)),
  CONSTRAINT `CONSTRAINT_4` CHECK (json_valid(`dicc_configuracion`))
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;