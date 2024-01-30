import path from "path";
import { PrismaClient, Prisma } from "../.prisma/client";
import { readCSV } from "./csvReader.mjs";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/L1Nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/L1Edges.csv");
//const requestsPath = path.join(path.resolve(), "prisma/Requests.csv");

const main = async () => {
  const nodes = readCSV(nodesPath);
  const edges = readCSV(edgesPath);
  //const requests = readCSV(requestsPath);

  for (const node of nodes) {
    await prisma.nodes.create({
      data: {
        ...node,
        xcoord: Number(node.xcoord),
        ycoord: Number(node.ycoord),
        //requestData: Prisma.NodesCreateWithoutRequestsInput,
      },
    });
  }

  for (const edge of edges) {
    await prisma.edges.create({
      data: {
        ...edge,
      },
    });
  }

  // for (const request of requests) {
  //     let i = 0;
  //     await prisma.requests.create({
  //         data: {
  //             id: i,
  //             ...request,
  //         },
  //     });
  //     i++;
  // }
};

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
