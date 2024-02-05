/**
 * Maps floor labels to numerical values for distance calculations.
 * @param {string} floorLabel
 * @returns {number}
 */
const mapFloorToNumber = (floorLabel) => {
    // Define custom mappings for floors
    const mappings = {
        'L1': -1,
        'L2': -2,
        '1': 1,
        '2': 2,
        '3': 3,
    };

    // Default to 0 if no floor
    return mappings[floorLabel] || 0;
};

/**
 * Adjusts the distance calculation considering different node types and floor changes with non-standard floor labels.
 *
 * @param {Nodes} nodeA
 * @param {Nodes} nodeB
 * @returns {number} The adjusted distance between two nodes.
 */
const calculateAdjustedDistance = (nodeA, nodeB) => {
    // Convert floor labels to numbers
    const floorA = mapFloorToNumber(nodeA.floor);
    const floorB = mapFloorToNumber(nodeB.floor);

    // Define weights for special transitions
    const elevatorWeight = 5; // ELEV wait time
    const stairsWeightPerFloor = 2; // STAI wait time

    if (floorA === floorB) {
        // Horizontal only if on the same floor
        return Math.sqrt(
            Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
            Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
        );
    } else {
        // Take in vertical if on different floors
        const floorDifference = Math.abs(floorA - floorB);
        if (nodeA.nodeType === 'ELEV' || nodeB.nodeType === 'ELEV') {
            // ADD ELEV WEIGHT
            //add ycoord to check matching elevator
            return floorDifference * elevatorWeight;
        } else if (nodeA.nodeType === 'STAI' || nodeB.nodeType === 'STAI') {
            // ADD STAI WEIGHT
            //add y coord to add matching stairs
            return floorDifference * stairsWeightPerFloor;
        } else {
            // Increase routing to avoid this path being taken (if no connection between floors)
            const discourageRouting = 10000;
            return discourageRouting;
        }
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
