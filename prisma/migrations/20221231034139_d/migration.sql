/*
  Warnings:

  - You are about to drop the `_GenreToLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_GenreToLike_B_index";

-- DropIndex
DROP INDEX "_GenreToLike_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GenreToLike";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT,
    "likeId" TEXT,
    CONSTRAINT "Genre_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Genre" ("id", "names") SELECT "id", "names" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
