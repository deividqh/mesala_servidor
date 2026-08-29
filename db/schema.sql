-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
-- ████████████████████  ESQUEMA MESALA V2
-- ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

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
  CONSTRAINT `chk_usuario_role` CHECK (`role` in ('admin','staff'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `foto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `titulo` varchar(160) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `slug` varchar(190) NOT NULL,
  `schema_version` smallint(5) unsigned NOT NULL DEFAULT 1,
  `captured_at` timestamp(3) NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `es_cerrada` tinyint(1) DEFAULT 0,
  `es_favorita` tinyint(1) NOT NULL DEFAULT 0,
  `salon` json NOT NULL,
  `app` json NOT NULL,
  `motores` json NOT NULL,
  `rangos` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_foto_slug` (`slug`),
  KEY `idx_foto_usuario_captured` (`usuario_id`,`captured_at`),
  KEY `idx_foto_usuario_favorita` (`usuario_id`,`es_favorita`,`captured_at`),
  KEY `idx_foto_usuario_cerrada` (`usuario_id`,`es_cerrada`,`captured_at`),
  CONSTRAINT `fk_foto_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_foto_schema_version` CHECK (`schema_version` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
