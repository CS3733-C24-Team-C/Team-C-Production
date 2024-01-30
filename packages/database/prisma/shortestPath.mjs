/**
 * Converts nodes and edges into a graph representation
 * @param {Array} edges - Array of edges with weights
 * @returns {Map<string, Array<{node: string, weight: number}>>} The graph.
 */
function createGraph(edges) {
  let graph = new Map();

  edges.forEach((edge) => {
    if (!graph.has(edge.startNode)) {
      graph.set(edge.startNode, []);
    }
    if (!graph.has(edge.endNode)) {
      graph.set(edge.endNode, []);
    }

    graph.get(edge.startNode).push({ node: edge.endNode, weight: edge.weight });
    // If the edges are bidirectional, also add the reverse edge
    graph.get(edge.endNode).push({ node: edge.startNode, weight: edge.weight });
  });

  return graph;
}

/**
 * Finds the shortest path using Dijkstra's algorithm
 * @param {string} start - The start node ID.
 * @param {string} end - The end node ID.
 * @param {Map<string, Array<{node: string, weight: number}>>} graph - The graph.
 * @returns {string[]} The shortest path as a list of node IDs.
 */
function dijkstraPathFinder(start, end, graph) {
  let distances = new Map();
  let predecessor = {};
  let pq = new PriorityQueue();
  pq.enqueue(start, 0);

  graph.forEach((_, node) => {
    distances.set(node, Infinity);
  });
  distances.set(start, 0);

  while (!pq.isEmpty()) {
    let { element: currentNode, priority: currentDistance } = pq.dequeue();

    if (currentNode === end) {
      return reconstructPath(predecessor, start, end);
    }

    for (let neighbor of graph.get(currentNode)) {
      let distance = currentDistance + neighbor.weight;

      if (distance < distances.get(neighbor.node)) {
        distances.set(neighbor.node, distance);
        predecessor[neighbor.node] = currentNode;
        pq.enqueue(neighbor.node, distance);
      }
    }
  }
  return []; // Path not found
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    let queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
