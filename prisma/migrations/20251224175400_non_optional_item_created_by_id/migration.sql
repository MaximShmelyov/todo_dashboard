/*
  Warnings:

  - Made the column `createdById` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_createdById_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
