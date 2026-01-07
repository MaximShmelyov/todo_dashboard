/*
  Warnings:

  - You are about to drop the column `used` on the `FamilyInvite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FamilyInvite" DROP COLUMN "used",
ADD COLUMN     "usedById" TEXT;

-- AddForeignKey
ALTER TABLE "FamilyInvite" ADD CONSTRAINT "FamilyInvite_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
