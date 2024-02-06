/*
  Warnings:

  - The primary key for the `Edges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Edges` table. All the data in the column will be lost.
  - The primary key for the `Nodes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `xCoord` on the `Nodes` table. All the data in the column will be lost.
  - You are about to drop the column `yCoord` on the `Nodes` table. All the data in the column will be lost.
  - Added the required column `edgeID` to the `Edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeID` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeType` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xcoord` to the `Nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ycoord` to the `Nodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_nodeId_fkey";

-- AlterTable
ALTER TABLE "Edges" DROP CONSTRAINT "Edges_pkey",
DROP COLUMN "id",
ADD COLUMN     "edgeID" TEXT NOT NULL,
ADD CONSTRAINT "Edges_pkey" PRIMARY KEY ("edgeID");

-- AlterTable
ALTER TABLE "Nodes" DROP CONSTRAINT "Nodes_pkey",
DROP COLUMN "id",
DROP COLUMN "type",
DROP COLUMN "xCoord",
DROP COLUMN "yCoord",
ADD COLUMN     "nodeID" TEXT NOT NULL,
ADD COLUMN     "nodeType" "NodeType" NOT NULL,
ADD COLUMN     "xcoord" INTEGER NOT NULL,
ADD COLUMN     "ycoord" INTEGER NOT NULL,
ADD CONSTRAINT "Nodes_pkey" PRIMARY KEY ("nodeID");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Nodes"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
