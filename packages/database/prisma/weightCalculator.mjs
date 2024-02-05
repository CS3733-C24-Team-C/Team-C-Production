/**
 * Maps floor labels to numerical values for distance calculations.
 * @param {string} floorLabel
 * @returns {number}
 */
const mapFloorToNumber = (floorLabel) => {
    // Remap floors to make integers
    const mappings = {
        'L1': -1,
        'L2': -2,
        '1': 1,
        '2': 2,
        '3': 3,
    };

    
    return mappings[floorLabel] || 0;
};

/**
 * Adjusts the distance calculation considering different node types, floor changes, and precise alignment for elevators and stairs.
 *
 * @param {Nodes} nodeA
 * @param {Nodes} nodeB
 * @returns {number} The adjusted distance between two nodes.
 */
const calculateAdjustedDistance = (nodeA, nodeB) => {
    // Label to number
    const floorA = mapFloorToNumber(nodeA.floor);
    const floorB = mapFloorToNumber(nodeB.floor);

    // Transitions handling
    const elevatorWeight = 5; // ELEV wait time
    const stairsWeight = 2; // STAIRS efforts/wait time

    if (floorA === floorB) {
        // Same floor, same plane, do regular calculation
        return Math.sqrt(
            Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
            Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
        );
    } else {
        // Y coordinates handling to check if elevators and stairs are connected (aligned/same y coord)
        const isDirectlyConnected = (nodeA.nodeType === 'ELEV' || nodeA.nodeType === 'STAI') &&
            (nodeB.nodeType === 'ELEV' || nodeB.nodeType === 'STAI') &&
            nodeA.ycoord === nodeB.ycoord;

        // Aligned, we calculate the weight by multypling the floor difference to the wait time.
        const floorDifference = Math.abs(floorA - floorB);
        if (isDirectlyConnected) {
            if (nodeA.nodeType === 'ELEV' && nodeB.nodeType === 'ELEV') {
                // ADD ELEV WEIGHT
                return floorDifference * elevatorWeight;
            } else if (nodeA.nodeType === 'STAI' && nodeB.nodeType === 'STAI') {
                // ADD STAIRS WEIGHT
                return floorDifference * stairsWeight;
            }
        }

        // Increase routing to avoid this path being taken (if no connection between floors)
        const discourageRouting = 10000;
        return discourageRouting;
    }
};



/**
 * Updates the calculateEdgeWeights function to use the new distance calculation, considering node types.
 */
export const calculateEdgeWeights = (nodes, edges) => {
    const nodeMap = new Map();
    nodes.forEach((node) => nodeMap.set(node.nodeID, {...node, xcoord: Number(node.xcoord), ycoord: Number(node.ycoord), floor: Number(node.floor), nodeType: node.nodeType}));

    const edgeWeights = edges.map((edge) => {
        const startNode = nodeMap.get(edge.startNode);
        const endNode = nodeMap.get(edge.endNode);

        if (!startNode || !endNode) {
            throw new Error("Node not found");
        }


        const weight = calculateAdjustedDistance(startNode, endNode);
        return { edgeID: edge.edgeID, weight };
    });

    return edgeWeights;
};
