import path from "path";
import { PrismaClient } from "database";
import { readCSV } from "./csvReader.mjs";
import {calculateEdgeWeights} from "./weightCalculator.mjs";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/L1Nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/L1Edges.csv");

const main = async () => {
    // read csv data
  const nodes = readCSV(nodesPath);
  const edges = readCSV(edgesPath);
    // calculate weight of edges
  const edgeWeights = calculateEdgeWeights(nodes, edges);

    // seed with nodes
  for (const node of nodes) {
    await prisma.nodes.create({
      data: {
        ...node,
        xcoord: Number(node.xcoord),
        ycoord: Number(node.ycoord),
      },
    });
  }
    // seed with edges
  for (const edge of edges) {
    await prisma.edges.create({
      data: {
        ...edge,
      },
    });
  }
    // seed with edges weight
    for (const edgeWeight of edgeWeights) {
        await prisma.edges.update({
            where: { edgeID: edgeWeight.edgeID },
            data: { weight: edgeWeight.weight }
        });
    }
};

try {
  await main();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
