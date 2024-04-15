-- CreateTable
CREATE TABLE `carreras` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `carrera` INTEGER UNSIGNED NULL,
    `recurrente` BOOLEAN NOT NULL DEFAULT false,
    `tipoensenanza` VARCHAR(50) NULL,
    `clasificacionevento` VARCHAR(50) NULL,
    `tipoevento` VARCHAR(50) NULL,
    `organizacion` VARCHAR(150) NULL,
    `zoom` VARCHAR(150) NULL,
    `linkflyer` VARCHAR(150) NULL,
    `sede` VARCHAR(150) NULL,
    `auditoria` VARCHAR(150) NULL,
    `nombre` VARCHAR(150) NULL,
    `fechahora` DATETIME(3) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `ponente` VARCHAR(250) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_carrera_id_foreign` FOREIGN KEY (`carrera`) REFERENCES `carreras`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
