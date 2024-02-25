import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

interface DijkstraNode {
    nodeId: string;
    cost: number;
    parent?: string;
}

class DijkstraPathfindingStrategy implements IPathfindingStrategy {
    async findPath(
        startNodeId: string,
        endNodeId: string,
        graph: Graph
    ): Promise<string[]> {
        const nodesQueue: DijkstraNode[] = [{ nodeId: startNodeId, cost: 0, parent: undefined }];
        const visited: Set<string> = new Set();
        const costs: Map<string, number> = new Map([[startNodeId, 0]]);
        const parents: Map<string, string | undefined> = new Map();

        while (nodesQueue.length > 0) {
            nodesQueue.sort((a, b) => a.cost - b.cost);
            const currentNode = nodesQueue.shift()!;

            if (currentNode.nodeId === endNodeId) {
                break; // End node has been reached
            }

            if (!visited.has(currentNode.nodeId)) {
                visited.add(currentNode.nodeId);
                const neighbors = graph.getNeighbors(currentNode.nodeId);
                if (neighbors) {
                    neighbors.forEach(({ endNode, weight }) => {
                        if (!visited.has(endNode)) {
                            const newCost = currentNode.cost + weight;
                            const currentCost = costs.get(endNode) || Infinity;

                            if (newCost < currentCost) {
                                costs.set(endNode, newCost);
                                parents.set(endNode, currentNode.nodeId);
                                nodesQueue.push({ nodeId: endNode, cost: newCost, parent: currentNode.nodeId });
                            }
                        }
                    });
                }
            }
        }

        return this.reconstructPath(parents, startNodeId, endNodeId);
    }

    private reconstructPath(
        parents: Map<string, string | undefined>,
        startNodeId: string,
        endNodeId: string
    ): string[] {
        const path: string[] = [];
        let currentNodeId: string | undefined = endNodeId;

        while (currentNodeId !== undefined && currentNodeId !== startNodeId) {
            path.unshift(currentNodeId);
            currentNodeId = parents.get(currentNodeId);
        }

        if (currentNodeId === startNodeId) {
            path.unshift(startNodeId);
        }

        return path;
    }
}

export { DijkstraPathfindingStrategy };
