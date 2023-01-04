-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "genre" TEXT,
    "title" TEXT,
    "likedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "poster" TEXT,
    "authorId" TEXT,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "genre", "id", "liked", "poster", "rating", "title") SELECT "authorId", "genre", "id", "liked", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
