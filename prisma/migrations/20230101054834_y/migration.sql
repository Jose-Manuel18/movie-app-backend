/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `genreId` on the `Like` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Genre";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "genre" TEXT,
    "title" TEXT NOT NULL,
    "movie_db_id" INTEGER NOT NULL,
    "likedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "poster" TEXT,
    "authorId" TEXT,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "id", "liked", "likedAt", "movie_db_id", "poster", "rating", "title") SELECT "authorId", "id", "liked", "likedAt", "movie_db_id", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE UNIQUE INDEX "Like_movie_db_id_key" ON "Like"("movie_db_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
