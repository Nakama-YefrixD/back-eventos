-- CreateTable
CREATE TABLE `eventosusuarios` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `usuid` INTEGER UNSIGNED NULL,
    `idevento` INTEGER UNSIGNED NULL,
    `certificado` VARCHAR(250) NULL,
    `encuestado` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `eventosusuarios` ADD CONSTRAINT `eventosusuarios_evento_id_foreign` FOREIGN KEY (`idevento`) REFERENCES `eventos`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eventosusuarios` ADD CONSTRAINT `eventosusuarios_usuid_foreign` FOREIGN KEY (`usuid`) REFERENCES `usuusuarios`(`usuid`) ON DELETE SET NULL ON UPDATE RESTRICT;
