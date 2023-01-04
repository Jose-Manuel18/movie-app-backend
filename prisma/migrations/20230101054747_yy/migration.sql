/*
  Warnings:

  - Added the required column `likeId` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT NOT NULL,
    "likeId" TEXT NOT NULL
);
INSERT INTO "new_Genre" ("id", "names") SELECT "id", "names" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
