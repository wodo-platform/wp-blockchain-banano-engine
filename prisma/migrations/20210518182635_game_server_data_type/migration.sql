/*
  Warnings:

  - You are about to drop the column `gameServerType` on the `GameServerUserData` table. All the data in the column will be lost.
  - Added the required column `gameType` to the `GameServerUserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameServerUserData` DROP COLUMN `gameServerType`,
    ADD COLUMN     `gameType` INTEGER NOT NULL;
