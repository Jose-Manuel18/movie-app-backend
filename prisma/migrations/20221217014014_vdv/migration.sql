/*
  Warnings:

  - Made the column `genre` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `poster` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Like` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "genre" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "genre", "id", "liked", "poster", "rating", "title") SELECT "authorId", "genre", "id", "liked", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
