-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL,
    "genre" TEXT,
    "title" TEXT,
    "movie_db_id" INTEGER NOT NULL,
    "likedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "poster" TEXT,
    "overview" TEXT,
    "authorId" TEXT,
    CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("authorId", "genre", "id", "liked", "likedAt", "movie_db_id", "overview", "poster", "rating", "title") SELECT "authorId", "genre", "id", "liked", "likedAt", "movie_db_id", "overview", "poster", "rating", "title" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE UNIQUE INDEX "Like_movie_db_id_key" ON "Like"("movie_db_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
