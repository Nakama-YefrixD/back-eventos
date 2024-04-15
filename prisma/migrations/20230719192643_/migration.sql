-- AlterTable
ALTER TABLE `eventos` ADD COLUMN `cupos` INTEGER NULL,
    ADD COLUMN `hrsextracurriculares` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `fechaseventos` ADD CONSTRAINT `fechaseventos_evento_id_foreign` FOREIGN KEY (`idevento`) REFERENCES `eventos`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
