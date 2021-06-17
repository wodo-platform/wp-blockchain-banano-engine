/*
  Warnings:

  - Added the required column `assetId` to the `GameServerUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `GameServerUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameServerUser` ADD COLUMN     `assetId` INTEGER NOT NULL,
    ADD COLUMN     `amount` INTEGER NOT NULL,
    ADD COLUMN     `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN     `leftAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `GameServer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `assetId` INTEGER NOT NULL,
    `data` JSON NOT NULL,
    `totalAmount` INTEGER NOT NULL,
    `revenue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameServerUserData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `gameServerId` INTEGER NOT NULL,
    `assetId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `reward` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leftAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
