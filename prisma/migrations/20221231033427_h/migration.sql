/*
  Warnings:

  - You are about to drop the column `genre` on the `Like` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT
);

-- CreateTable
CREATE TABLE "_GenreToLike" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GenreToLike_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GenreToLike_B_fkey" FOREIGN KEY ("B") REFERENCES "Like" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "title" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToLike_AB_unique" ON "_GenreToLike"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToLike_B_index" ON "_GenreToLike"("B");
