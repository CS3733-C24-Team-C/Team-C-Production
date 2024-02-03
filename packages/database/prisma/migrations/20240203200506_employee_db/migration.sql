/*
  Warnings:

  - Added the required column `weight` to the `Edges` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('UNSG', 'ASGN', 'PROG', 'COMP');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('REG', 'ADM');

-- AlterTable
ALTER TABLE "Edges" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "compStatus" "RequestStatus" NOT NULL DEFAULT 'UNSG',
ADD COLUMN     "employeeID" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Employees" (
    "employeeID" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("employeeID")
);

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employees"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
