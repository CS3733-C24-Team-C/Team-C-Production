import path from "path";
import { PrismaClient } from "../.prisma/client";
import { readCSV } from "./csvReader.mjs";
import { calculateEdgeWeights } from "./weightCalculator.mjs";

const prisma = new PrismaClient();
const nodesPath = path.join(path.resolve(), "prisma/L1Nodes.csv");
const edgesPath = path.join(path.resolve(), "prisma/L1Edges.csv");

async function main() {
    const nodes = readCSV(nodesPath);
    const edges = readCSV(edgesPath);

    const edgeWeights = calculateEdgeWeights(nodes, edges);

    const nodesByFloor = {};
    for (const node of nodes) {
        if (!nodesByFloor[node.floor]) {
            nodesByFloor[node.floor] = [];
        }
        nodesByFloor[node.floor].push(node);
    }

    for (const [floor, floorNodes] of Object.entries(nodesByFloor)) {
        console.log(`Seeding nodes for floor ${floor}`);
        for (const node of floorNodes) {
            await prisma.nodes.create({
                data: {
                    ...node,
                    xcoord: Number(node.xcoord),
                    ycoord: Number(node.ycoord);
                },
            });
        }
    }

    for (const edge of edges) {
        const edgeWeightEntry = edgeWeights.find(e => e.edgeID === edge.edgeID);
        if (!edgeWeightEntry) {
            console.error(`No weight found for edgeID: ${edge.edgeID}`);
            continue;
        }
        await prisma.edges.create({
            data: {
                ...edge,
                weight: edgeWeightEntry.weight,
            },
        });
    }
}
try {
    await main();
    await prisma.$disconnect();
} catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
}
