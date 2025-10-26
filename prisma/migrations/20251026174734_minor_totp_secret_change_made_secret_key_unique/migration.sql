/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `TOTPSecret` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TOTPSecret_secret_key" ON "TOTPSecret"("secret");
