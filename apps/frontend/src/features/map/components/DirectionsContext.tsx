import { createContext, Dispatch, SetStateAction } from "react";

const DirectionsContext = createContext<{
  path: string[];
  setPath: Dispatch<string[]>;
}>({
  path: [],
  // eslint-disable-next-line no-empty-function
  setPath: () => {},
});

const StartContext = createContext<{
  start: string;
  setStart: Dispatch<SetStateAction<string>>;
}>({
  start: "",
  setStart: () => {},
});

const EndContext = createContext<{
  end: string;
  setEnd: Dispatch<SetStateAction<string>>;
}>({
  end: "",
  setEnd: () => {},
});

export { DirectionsContext, StartContext, EndContext };