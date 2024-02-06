import { createGraph, shortestPathAStar } from "./shortestPath.ts";
import { describe, it, expect } from "vitest";

describe("A Star Path Finder", () => {
  it("should find the shortest path in a graph", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "B", endNode: "C", weight: 2 },
      { startNode: "A", endNode: "C", weight: 10 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "C", graph);

    expect(path).toEqual(["A", "B", "C"]);
  });

  it("should return an empty array if no path exists", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "C", endNode: "D", weight: 2 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    expect(path).toEqual([]);
  });

  it("should find a direct path when it's the shortest", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 5 },
      { startNode: "A", endNode: "C", weight: 15 },
      { startNode: "B", endNode: "C", weight: 5 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "B", graph);

    expect(path).toEqual(["A", "B"]);
  });

  it("should handle a graph with a single node", () => {
    const edges = [{ startNode: "A", endNode: "A", weight: 0 }];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "A", graph);

    expect(path).toEqual(["A"]);
  });

  it("should return the shortest path when multiple paths with the same weight exist", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 2 },
      { startNode: "A", endNode: "C", weight: 2 },
      { startNode: "B", endNode: "D", weight: 1 },
      { startNode: "C", endNode: "D", weight: 1 },
      { startNode: "A", endNode: "D", weight: 3 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    // The shortest path can be either 'A' -> 'D' directly, or 'A' -> 'B' -> 'D', or 'A' -> 'C' -> 'D'
    expect(path).toContain("A");
    expect(path).toContain("D");
    expect(path.length).toBeLessThanOrEqual(3); // The path should not be longer than 3 nodes
  });

  it("should return an empty array for disconnected components", () => {
    const edges = [
      { startNode: "A", endNode: "B", weight: 1 },
      { startNode: "C", endNode: "D", weight: 1 },
    ];

    const graph = createGraph(edges);
    const path = shortestPathAStar("A", "D", graph);

    expect(path).toEqual([]);


  });
});

describe("A Star Path Finder Additional Tests", () => {
    it("should prefer paths with lower overall weight", () => {
        const edges = [
            { startNode: "A", endNode: "B", weight: 4 },
            { startNode: "B", endNode: "C", weight: 1 },
            { startNode: "A", endNode: "C", weight: 5 },
            { startNode: "C", endNode: "D", weight: 1 },
            { startNode: "B", endNode: "D", weight: 2 },
        ];

        const graph = createGraph(edges);
        const path = shortestPathAStar("A", "D", graph);

        expect(path).toEqual(["A", "B", "C", "D"]);
    });

    it("should avoid paths with high weight if possible", () => {
        const edges = [
            { startNode: "A", endNode: "B", weight: 1 },
            { startNode: "B", endNode: "C", weight: 10 }, // High weight edge
            { startNode: "A", endNode: "C", weight: 2 },
            { startNode: "C", endNode: "D", weight: 2 },
        ];

        const graph = createGraph(edges);
        const path = shortestPathAStar("A", "D", graph);

        expect(path).toEqual(["A", "C", "D"]);
    });

    it("handles large graph with multiple paths", () => {
        const edges = [
            { startNode: "A", endNode: "B", weight: 2 },
            { startNode: "B", endNode: "C", weight: 2 },
            { startNode: "C", endNode: "D", weight: 2 },
            { startNode: "A", endNode: "E", weight: 1 },
            { startNode: "E", endNode: "D", weight: 4 },
            { startNode: "A", endNode: "F", weight: 3 },
            { startNode: "F", endNode: "D", weight: 3 },
            { startNode: "B", endNode: "F", weight: 1 },
            { startNode: "C", endNode: "E", weight: 1 },
        ];

        const graph = createGraph(edges);
        const path = shortestPathAStar("A", "D", graph);

        // Expected to find the most efficient path considering all possible routes
        expect(path).toEqual(["A", "B", "C", "D"]);
    });

    it("should handle nodes with zero weight paths correctly", () => {
        const edges = [
            { startNode: "A", endNode: "B", weight: 0 },
            { startNode: "B", endNode: "C", weight: 0 },
            { startNode: "C", endNode: "D", weight: 0 },
            { startNode: "A", endNode: "D", weight: 1 },
        ];

        const graph = createGraph(edges);
        const path = shortestPathAStar("A", "D", graph);

        // Despite the direct path having a weight, zero-weight paths should be considered
        expect(path).toEqual(["A", "B", "C", "D"]);
    });

    it("should handle complex graph with multiple optimal paths", () => {
        const edges = [
            { startNode: "A", endNode: "B", weight: 3 },
            { startNode: "B", endNode: "C", weight: 3 },
            { startNode: "C", endNode: "D", weight: 3 },
            { startNode: "A", endNode: "E", weight: 3 },
            { startNode: "E", endNode: "D", weight: 3 },
            { startNode: "A", endNode: "F", weight: 2 },
            { startNode: "F", endNode: "G", weight: 2 },
            { startNode: "G", endNode: "D", weight: 2 },
        ];

        const graph = createGraph(edges);
        const path = shortestPathAStar("A", "D", graph);


        expect(path).toHaveLength(4); // The shortest path should consist of
    });
});
