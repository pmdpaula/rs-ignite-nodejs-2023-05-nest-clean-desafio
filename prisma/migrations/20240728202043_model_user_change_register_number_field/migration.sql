/*
  Warnings:

  - You are about to drop the column `register` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[register_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `register_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_register_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "register",
ADD COLUMN     "register_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_register_number_key" ON "users"("register_number");
