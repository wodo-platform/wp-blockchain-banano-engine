/*
  Warnings:

  - Added the required column `gameServerType` to the `GameServerUserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameServerUserData` ADD COLUMN     `gameServerType` INTEGER NOT NULL;
