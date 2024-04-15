/*
  Warnings:

  - You are about to drop the column `fecha` on the `eventos` table. All the data in the column will be lost.
  - You are about to drop the column `fechahora` on the `eventos` table. All the data in the column will be lost.
  - You are about to drop the column `ponente` on the `eventos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eventos` DROP COLUMN `fecha`,
    DROP COLUMN `fechahora`,
    DROP COLUMN `ponente`;

-- CreateTable
CREATE TABLE `fechaseventos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idevento` INTEGER UNSIGNED NULL,
    `fechora` VARCHAR(50) NULL,
    `fecha` VARCHAR(50) NULL,
    `hora` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ponenteseventos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idevento` INTEGER UNSIGNED NULL,
    `ponente` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
