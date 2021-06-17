/*
  Warnings:

  - Added the required column `status` to the `GameServerUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameServerUser` ADD COLUMN     `status` INTEGER NOT NULL;
