-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('ELEV', 'REST', 'STAI', 'DEPT', 'LABS', 'INFO', 'CONF', 'EXIT', 'RETL', 'SERV', 'HALL', 'BATH');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('JANI', 'MECH', 'MEDI', 'RELC', 'CONS', 'CUST');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('REGULAR', 'ADMIN');

-- CreateTable
CREATE TABLE "Nodes" (
                         "id" TEXT NOT NULL,
                         "xCoord" INTEGER NOT NULL,
                         "yCoord" INTEGER NOT NULL,
                         "floor" TEXT NOT NULL,
                         "building" TEXT NOT NULL,
                         "type" "NodeType" NOT NULL,
                         "longName" TEXT NOT NULL,
                         "shortName" TEXT NOT NULL,

                         CONSTRAINT "Nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edges" (
                         "id" TEXT NOT NULL,
                         "startNode" TEXT NOT NULL,
                         "endNode" TEXT NOT NULL,
                         "weight" DOUBLE PRECISION NOT NULL,

                         CONSTRAINT "Edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
                            "id" SERIAL NOT NULL,
                            "nodeId" TEXT NOT NULL,
                            "employeeId" INTEGER NOT NULL DEFAULT 0,
                            "urgency" "Urgency" NOT NULL,
                            "type" "RequestType" NOT NULL,
                            "notes" TEXT,
                            "completionStatus" "RequestStatus" NOT NULL DEFAULT 'UNASSIGNED',

                            CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
                             "id" INTEGER NOT NULL,
                             "firstName" TEXT NOT NULL,
                             "lastName" TEXT NOT NULL,
                             "role" "StaffRole" NOT NULL,
                             "login" TEXT NOT NULL,
                             "password" TEXT NOT NULL,

                             CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
