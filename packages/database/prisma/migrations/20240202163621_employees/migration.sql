/*
  Warnings:

  - Added the required column `weight` to the `Edges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edges" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Employees" (
    "employeeID" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("employeeID")
);