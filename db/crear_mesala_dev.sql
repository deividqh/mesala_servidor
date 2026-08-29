USE mesala_v2_dev;
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

CREATE TABLE foto (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT UNSIGNED NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    mensaje TEXT NULL DEFAULT NULL,
    slug VARCHAR(190) NOT NULL,
    schema_version SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    captured_at TIMESTAMP(3) NOT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
    es_cerrada TINYINT(1) DEFAULT 0,
    es_favorita TINYINT(1) NOT NULL DEFAULT 0,
    salon JSON NOT NULL,
    app JSON NOT NULL,
    motores JSON NOT NULL,
    rangos JSON NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_foto_slug UNIQUE (slug),
    CONSTRAINT fk_foto_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT chk_foto_schema_version CHECK (schema_version >= 1),
    INDEX idx_foto_usuario_captured (usuario_id, captured_at),
    INDEX idx_foto_usuario_favorita (usuario_id, es_favorita, captured_at),
    INDEX idx_foto_usuario_cerrada (usuario_id, es_cerrada, captured_at)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
