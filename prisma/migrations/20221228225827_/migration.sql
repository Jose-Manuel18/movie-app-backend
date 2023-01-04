/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[poster]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_title_key" ON "Like"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Like_poster_key" ON "Like"("poster");
