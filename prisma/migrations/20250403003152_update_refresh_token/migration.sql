/*
  Warnings:

  - A unique constraint covering the columns `[userId,token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_token_key" ON "RefreshToken"("userId", "token");
