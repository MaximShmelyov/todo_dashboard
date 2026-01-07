/*
  Warnings:

  - Made the column `issuedById` on table `FamilyInvite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FamilyInvite" DROP CONSTRAINT "FamilyInvite_issuedById_fkey";

-- AlterTable
ALTER TABLE "FamilyInvite" ALTER COLUMN "issuedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FamilyInvite" ADD CONSTRAINT "FamilyInvite_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
