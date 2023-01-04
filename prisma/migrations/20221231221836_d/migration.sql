/*
  Warnings:

  - You are about to drop the column `likeId` on the `Genre` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "title" TEXT NOT NULL,
    "movie_db_id" INTEGER NOT NULL,
    "likedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "poster" TEXT,
    "authorId" TEXT,
    "genreId" TEXT,
    CONSTRAINT "Like_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "id", "liked", "likedAt", "movie_db_id", "poster", "rating", "title") SELECT "authorId", "id", "liked", "likedAt", "movie_db_id", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE UNIQUE INDEX "Like_movie_db_id_key" ON "Like"("movie_db_id");
CREATE TABLE "new_Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT NOT NULL
);
INSERT INTO "new_Genre" ("id", "names") SELECT "id", "names" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
