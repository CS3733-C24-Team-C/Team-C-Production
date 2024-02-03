//createContext
import React, {
  Dispatch,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import logoUrl from "/logo.png";
import { drawerId } from "../constants";
import {
  Sidebar as FlowbiteSidebar,
  Button,
  CustomFlowbiteTheme,
} from "flowbite-react";
import { LocationSearch } from "@/features/map/components";

import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

import Nodes from "@/features/map/components/nodes.tsx";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-full",
  },
  logo: {
    img: "",
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
            <LocationSearch />
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
        <Nodes
          left={coords[0]}
          right={coords[1]}
          top={coords[2]}
          bottom={coords[3]}
          width={coords[4]}
          height={coords[5]}
        />
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
