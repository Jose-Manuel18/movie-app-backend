/*
  Warnings:

  - Made the column `names` on table `Genre` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT NOT NULL,
    "likeId" TEXT,
    CONSTRAINT "Genre_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Genre" ("id", "likeId", "names") SELECT "id", "likeId", "names" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
