-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "transactions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("authorId", "categoryId", "createdAt", "date", "description", "id", "type", "updatedAt", "value") SELECT "authorId", "categoryId", "createdAt", "date", "description", "id", "type", "updatedAt", "value" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE INDEX "transactions_authorId_date_idx" ON "transactions"("authorId", "date");
CREATE INDEX "transactions_authorId_categoryId_idx" ON "transactions"("authorId", "categoryId");
CREATE INDEX "transactions_authorId_type_date_idx" ON "transactions"("authorId", "type", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
