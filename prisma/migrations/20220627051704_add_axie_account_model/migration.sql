-- CreateTable
CREATE TABLE "AxieAccount" (
    "roninAdd" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scholarShare" INTEGER NOT NULL,
    "managerShare" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AxieAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
