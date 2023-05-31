-- CreateTable
CREATE TABLE `pempermisos` (
    `pemid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pemnombre` VARCHAR(255) NOT NULL,
    `pemslug` VARCHAR(255) NOT NULL,
    `pemruta` VARCHAR(255) NULL,
    `pemespecial` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`pemid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuptiposusuariospermisos` (
    `tupid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pemid` INTEGER UNSIGNED NULL,
    `tpuid` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`tupid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tuptiposusuariospermisos` ADD CONSTRAINT `tuptiposusuariospermisos_pemid_foreign` FOREIGN KEY (`pemid`) REFERENCES `pempermisos`(`pemid`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tuptiposusuariospermisos` ADD CONSTRAINT `tuptiposusuariospermisos_tpuid_foreign` FOREIGN KEY (`tpuid`) REFERENCES `tputiposusuarios`(`tpuid`) ON DELETE SET NULL ON UPDATE RESTRICT;
