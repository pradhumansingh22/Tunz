-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_streamId_fkey";

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
