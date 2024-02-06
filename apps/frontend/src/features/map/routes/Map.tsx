//createContext
import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,
} from "flowbite-react";
import { LocationSearch } from "../components/LocationSearch";
//createContext
import React, {
  Dispatch,
  createContext,
  useEffect,
  useRef,
  useState,
  ErrorInfo,
  ReactNode,
} from "react";
import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

//import Nodes from "@/features/map/components/nodes.tsx";
import Lines from "@/features/map/components/lines.tsx";

class ErrorBoundary extends React.Component<{ children: ReactNode }> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-full",
    collapsed: {
      off: "w-200",
    },
  },
  logo: {
    img: "",
  },
  item: {
    content: {
      base: "px-3 flex-1", //"px-3 flex-1 whitespace-nowrap"
    },
  },
};

type SidebarProps = {
  setSelectedFloor: (value: string) => void;
};

const Sidebar = ({ setSelectedFloor }: SidebarProps) => {
  return (
    <FlowbiteSidebar aria-label="Map sidebar" theme={sidebarTheme}>
      <Button
        data-drawer-target={drawerId}
        data-drawer-show={drawerId}
        aria-controls={drawerId}
      >
        Show navigation
      </Button>
      <FlowbiteSidebar.Logo href="/" img={logoUrl} imgAlt="Hospital logo" />

      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item>
            <select
              className="w-full"
              name="mapFloor"
              id="mapFloor"
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value={groundFloor}>Ground Floor</option>
              <option value={lowerLevel1}>Lower Level 1</option>
              <option value={lowerLevel2}>Lower Level 2</option>
              <option value={firstFloor}>First Floor</option>
              <option value={secondFloor}>Second Floor</option>
              <option value={thirdFloor}>Third Floor</option>
            </select>
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item>
            <ErrorBoundary>
              <LocationSearch />
            </ErrorBoundary>
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

const MapDisplay = (props: { selectedFloor: string }) => {
  const elementRef = useRef<HTMLImageElement>(null);
  const [coords, setCoords] = useState<number[]>([]);

  useEffect(() => {
    const updateCoords = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        const bottom = rect.bottom;
        const right = rect.right;
        const width = rect.width;
        const height = rect.height;
        setCoords([left, right, top, bottom, width, height]);
        console.log(rect.top, rect.left, rect.bottom, rect.right);
      }
    };

    updateCoords(); // Initial calculation

    window.addEventListener("resize", updateCoords);

    return () => {
      window.removeEventListener("resize", updateCoords);
    };
  }, []);

  return (
    <>
      <div style={{ position: "relative" }}>
        <img
          ref={elementRef}
          src={props.selectedFloor}
          alt={"Floor image"}
          width={"1000"}
          height={"auto"}
        />
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Lines
            top={coords[2]}
            left={coords[0]}
            height={coords[5]}
            width={coords[4]}
            bottom={coords[3]}
            right={coords[1]}
            selectedFloor={props.selectedFloor}
          ></Lines>
        </div>
      </div>
    </>
  );
};

const DirectionsContext = createContext({
  path: [],
  // @ts-expect-error No actual error lol
  setPath: Dispatch<React.SetStateAction<string[]>>,
});

const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState(groundFloor);
  const [path, setPath] = useState([]);

  return (
    <DirectionsContext.Provider value={{ path, setPath }}>
      <div className="flex">
        <Sidebar setSelectedFloor={setSelectedFloor} />
        <MapDisplay selectedFloor={selectedFloor} />
      </div>
    </DirectionsContext.Provider>
  );
};

export { Map, DirectionsContext };

//<directionsContext.Provider value={{direction, setDirection}}>
//</directionsContext.Provider>
//<button onClick={() => console.log(direction)}>My button</button>
