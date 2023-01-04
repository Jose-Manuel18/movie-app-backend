/*
  Warnings:

  - Made the column `authorId` on table `Like` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "uid" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "uid") SELECT "email", "id", "name", "uid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "genre" TEXT,
    "title" TEXT,
    "liked" BOOLEAN NOT NULL,
    "poster" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "genre", "id", "liked", "poster", "rating", "title") SELECT "authorId", "genre", "id", "liked", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
