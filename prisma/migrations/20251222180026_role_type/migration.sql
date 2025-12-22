/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleType` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_roleId_fkey";

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "roleType" "RoleType" NOT NULL;

-- DropTable
DROP TABLE "Role";
