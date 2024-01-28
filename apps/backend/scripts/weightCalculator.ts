// Define interfaces for nodes and edges
interface Node {
    nodeID: string;
    xcoord: number;
    ycoord: number;
    // Other properties can be added as needed
}

interface Edge {
    edgeID: string;
    startNode: string;
    endNode: string;
}

interface EdgeWeight {
    edgeID: string;
    weight: number;
}

// Function to calculate Euclidean distance between two nodes
function calculateDistance(nodeA: Node, nodeB: Node): number {
    return Math.sqrt(Math.pow(nodeA.xcoord - nodeB.xcoord, 2) + Math.pow(nodeA.ycoord - nodeB.ycoord, 2));
}

// Function to calculate weights of edges
function calculateEdgeWeights(nodes: Node[], edges: Edge[]): EdgeWeight[] {
    const nodeMap = new Map<string, Node>();
    nodes.forEach(node => nodeMap.set(node.nodeID, node));

    const edgeWeights: EdgeWeight[] = edges.map(edge => {
        const startNode = nodeMap.get(edge.startNode);
        const endNode = nodeMap.get(edge.endNode);

        if (!startNode || !endNode) {
            throw new Error('Node not found');
        }

        const weight = calculateDistance(startNode, endNode);
        return { edgeID: edge.edgeID, weight };
    });

    return edgeWeights;
}
