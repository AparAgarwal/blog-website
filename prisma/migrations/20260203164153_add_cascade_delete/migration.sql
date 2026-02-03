-- DropIndex
DROP INDEX "Post_nextPostId_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "nextNavConfig" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "prevNavConfig" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "prevPostId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_prevPostId_fkey" FOREIGN KEY ("prevPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
