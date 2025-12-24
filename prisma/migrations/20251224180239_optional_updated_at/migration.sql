-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "updatedAt" DROP NOT NULL;
