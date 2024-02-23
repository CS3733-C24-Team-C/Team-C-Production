import { Edges, Nodes, Requests } from "database";
import { createContext, Dispatch, SetStateAction } from "react";

const MapContext = createContext<{
  nodes: Nodes[];
  setNodes: Dispatch<SetStateAction<Nodes[]>>;
  edges: Edges[];
  setEdges: Dispatch<SetStateAction<Edges[]>>;
  selectedFloor: string;
  setSelectedFloor: Dispatch<SetStateAction<string>>;
  algorithm: string;
  setAlgorithm: Dispatch<SetStateAction<string>>;
  path: string[];
  setPath: Dispatch<string[]>;
  startLocation: string;
  setStartLocation: Dispatch<SetStateAction<string>>;
  endLocation: string;
  setEndLocation: Dispatch<SetStateAction<string>>;
  startID: string;
  setStartID: Dispatch<SetStateAction<string>>;
  endID: string;
  setEndID: Dispatch<SetStateAction<string>>;
  requests: Requests[];
  setRequests: Dispatch<SetStateAction<Requests[]>>;
  center: number[];
  setCenter: Dispatch<number[]>;
}>({
  nodes: [],
  // eslint-disable-next-line no-empty-function
  setNodes: () => {},
  edges: [],
  // eslint-disable-next-line no-empty-function
  setEdges: () => {},
  selectedFloor: "",
  // eslint-disable-next-line no-empty-function
  setSelectedFloor: () => {},
  algorithm: "",
  // eslint-disable-next-line no-empty-function
  setAlgorithm: () => {},
  path: [],
  // eslint-disable-next-line no-empty-function
  setPath: () => {},
  startLocation: "",
  // eslint-disable-next-line no-empty-function
  setStartLocation: () => {},
  endLocation: "",
  // eslint-disable-next-line no-empty-function
  setEndLocation: () => {},
  startID: "",
  // eslint-disable-next-line no-empty-function
  setStartID: () => {},
  endID: "",
  // eslint-disable-next-line no-empty-function
  setEndID: () => {},
  requests: [],
  // eslint-disable-next-line no-empty-function
  setRequests: () => {},
  center: [],
  // eslint-disable-next-line no-empty-function
  setCenter: () => {},
});

export { MapContext };
