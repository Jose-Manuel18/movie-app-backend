/*
  Warnings:

  - A unique constraint covering the columns `[movie_db_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_movie_db_id_key" ON "Like"("movie_db_id");
