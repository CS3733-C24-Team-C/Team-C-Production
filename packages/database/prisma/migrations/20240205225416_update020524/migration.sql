/*
  Warnings:

  - The values [UNSG,ASGN,PROG,COMP] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REG,ADM] on the enum `StaffRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOWU,MEDI] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Edges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `edgeID` on the `Edges` table. All the data in the column will be lost.
  - The primary key for the `Employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employeeID` on the `Employees` table. All the data in the column will be lost.
  - The primary key for the `Nodes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nodeID` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `nodeType` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `xcoord` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `ycoord` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `compStatus` on the `Requests` table. All the data in the column will be lost.
  - You are about to drop the column `employeeID` on the `Requests` table. All the data in the column will be lost.
  - You are about to drop the column `nodeID` on the `Requests` table. All the data in the column will be lost.
  - Added the required column `id` to the `Edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xCoord` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yCoord` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'BATH';

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "Requests" ALTER COLUMN "compStatus" DROP DEFAULT;
ALTER TABLE "Requests" ALTER COLUMN "completionStatus" TYPE "RequestStatus_new" USING ("completionStatus"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StaffRole_new" AS ENUM ('REGULAR', 'ADMIN');
ALTER TABLE "Employees" ALTER COLUMN "role" TYPE "StaffRole_new" USING ("role"::text::"StaffRole_new");
ALTER TYPE "StaffRole" RENAME TO "StaffRole_old";
ALTER TYPE "StaffRole_new" RENAME TO "StaffRole";
DROP TYPE "StaffRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Requests" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_employeeID_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_nodeID_fkey";

-- AlterTable
ALTER TABLE "Edges" DROP CONSTRAINT "Edges_pkey",
DROP COLUMN "edgeID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Edges_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_pkey",
DROP COLUMN "employeeID",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Employees_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Nodes" DROP CONSTRAINT "Nodes_pkey",
DROP COLUMN "nodeID",
DROP COLUMN "nodeType",
DROP COLUMN "xcoord",
DROP COLUMN "ycoord",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "type" "NodeType" NOT NULL,
ADD COLUMN     "xCoord" INTEGER NOT NULL,
ADD COLUMN     "yCoord" INTEGER NOT NULL,
ADD CONSTRAINT "Nodes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "compStatus",
DROP COLUMN "employeeID",
DROP COLUMN "nodeID",
ADD COLUMN     "completionStatus" "RequestStatus" NOT NULL DEFAULT 'UNASSIGNED',
ADD COLUMN     "employeeId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nodeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
