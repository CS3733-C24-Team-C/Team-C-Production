import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { createGraph, dijkstraPathFinder } from "../shortestPath.ts";

const router: Router = express.Router();

type Graph = Map<string, Array<{ node: string; weight: number }>>;

let graph: Graph | null = null;

router.get("/nodes", async function (req: Request, res: Response) {
    const nodes = await PrismaClient.nodes.findMany();
    res.json(nodes);
});

router.get("/edges", async function (req: Request, res: Response) {
    const edges = await PrismaClient.edges.findMany();
    res.json(edges);
});

// Fetch edges and create the graph when the server starts
async function initializeGraph() {
    try {
        const edges = await PrismaClient.edges.findMany();
        graph = createGraph(edges);
    } catch (error) {
        console.error("Error initializing the graph:", error);
        graph = null;
    }
}

initializeGraph()
    .then(() => {
        console.log("Graph has been successfully initialized");
    })
    .catch((error) => {
        console.error("Failed to initialize the graph:", error);
    });

router.get("/pathfinding", async function (req: Request, res: Response) {
    if (!graph) {
        // The graph is not ready yet
        return res
            .status(503)
            .send("The graph is still initializing. Please try again later.");
    }
    const { startNodeId, endNodeId } = req.query;

    if (!startNodeId || !endNodeId) {
        return res.status(400).send("Both startNodeId and endNodeId are required");
    }

    try {
        // Check if the startNodeId exists
        const startNodeExists = await PrismaClient.nodes.findUnique({
            where: { nodeID: startNodeId as string },
        });

        if (!startNodeExists) {
            return res.status(404).send("Start node ID not found");
        }

        // Check if the endNodeId exists
        const endNodeExists = await PrismaClient.nodes.findUnique({
            where: { nodeID: endNodeId as string },
        });

        if (!endNodeExists) {
            return res.status(404).send("End node ID not found");
        }

        // Both nodes exist; proceed with finding the path
        const pathNodeIds = dijkstraPathFinder(
            startNodeId as string,
            endNodeId as string,
            graph,
        );

        res.json({ path: pathNodeIds });
    } catch (error) {
        console.error("Error processing find-path request:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;
