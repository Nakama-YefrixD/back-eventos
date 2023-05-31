-- CreateTable
CREATE TABLE `usuusuarios` (
    `usuid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tpuid` INTEGER UNSIGNED NOT NULL,
    `usutipo_documento_identidad` VARCHAR(15) NULL,
    `usunumero_dni` VARCHAR(20) NULL,
    `usucodigo_ucs` VARCHAR(255) NULL,
    `usufecha_nacimiento` VARCHAR(50) NULL,
    `usucelular` VARCHAR(20) NULL,
    `usurol` VARCHAR(255) NULL,
    `usunombre` VARCHAR(255) NULL,
    `usuapell_paterno` VARCHAR(255) NULL,
    `usuapell_materno` VARCHAR(255) NULL,
    `usuimagen` VARCHAR(255) NULL,
    `usuusuario` VARCHAR(255) NULL,
    `usucontrasena` VARCHAR(255) NULL,
    `usutoken` VARCHAR(255) NOT NULL,
    `usuestado` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`usuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tputiposusuarios` (
    `tpuid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tpunombre` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`tpuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuusuarios` ADD CONSTRAINT `usuusuarios_tpuid_foreign` FOREIGN KEY (`tpuid`) REFERENCES `tputiposusuarios`(`tpuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;
