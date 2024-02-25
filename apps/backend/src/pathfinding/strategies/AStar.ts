import { IPathfindingStrategy } from "../IPathfindingStrategy.ts";
import { Graph } from "../GraphSingleton.ts";

interface AStarNode {
    nodeId: string;
    gCost: number;
    hCost: number;
    fCost: number;
    parent?: AStarNode;
}

class AStarPathfindingStrategy implements IPathfindingStrategy {
    async findPath(
        startNodeId: string,
        endNodeId: string,
        graph: Graph
    ): Promise<string[]> {
        let openSet: AStarNode[] = [];
        const closedSet: Set<string> = new Set();

        const heuristic = (nodeIdA: string, nodeIdB: string): number => {
            const nodeA = graph.getNode(nodeIdA);
            const nodeB = graph.getNode(nodeIdB);

            if (!nodeA || !nodeB) return Infinity;

            const mapFloorToNumber = (floorLabel: string | number): number => {
                const mappings: { [key: string]: number } = {
                    L1: -1,
                    L2: -2,
                    "1": 1,
                    "2": 2,
                    "3": 3,
                };
                return mappings[floorLabel.toString()] || 0;
            };

            const nodeAFloor = mapFloorToNumber(nodeA.floor);
            const nodeBFloor = mapFloorToNumber(nodeB.floor);

            
            const verticalDistance = Math.abs(nodeAFloor - nodeBFloor);
            const horizontalDistance = Math.sqrt(
                Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
                Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
            );

           
            const verticalCostMultiplier = verticalDistance > 0 ? 50 : 0; 

            return horizontalDistance + verticalCostMultiplier * verticalDistance;
        };

        openSet.push({
            nodeId: startNodeId,
            gCost: 0,
            hCost: heuristic(startNodeId, endNodeId),
            fCost: heuristic(startNodeId, endNodeId),
        });

        while (openSet.length > 0) {
            let current = openSet.reduce((prev, curr) => prev.fCost < curr.fCost ? prev : curr);

            if (current.nodeId === endNodeId) {
                const path = [];
                while (current) {
                    path.unshift(current.nodeId);
                    if (!current.parent) break;
                    current = current.parent;
                }
                return path;
            }

            openSet = openSet.filter((node) => node.nodeId !== current.nodeId);
            closedSet.add(current.nodeId);

            const neighbors = graph.getNeighbors(current.nodeId);
            if (!neighbors) {
                return [];
            }

            neighbors.forEach((neighbor) => {
                if (closedSet.has(neighbor.endNode)) return;

                const tentativeGCost = current.gCost + neighbor.weight;
                let neighborNode = openSet.find((n) => n.nodeId === neighbor.endNode);
                let isNewPathShorter = false;

                if (!neighborNode) {
                    neighborNode = {
                        nodeId: neighbor.endNode,
                        gCost: Infinity,
                        hCost: heuristic(neighbor.endNode, endNodeId),
                        fCost: Infinity,
                    };
                    openSet.push(neighborNode);
                    isNewPathShorter = true;
                } else if (tentativeGCost < neighborNode.gCost) {
                    isNewPathShorter = true;
                }

                if (isNewPathShorter) {
                    neighborNode.gCost = tentativeGCost;
                    neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
                    neighborNode.parent = current;
                }
            });
        }

        return [];
    }
}

export { AStarPathfindingStrategy };
