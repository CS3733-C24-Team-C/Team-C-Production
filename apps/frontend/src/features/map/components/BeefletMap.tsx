import React, { useContext, useEffect, useState } from "react";
import {
    MapContainer,
    ImageOverlay,
    Circle,
    Polyline,
    Popup,
    FeatureGroup,
} from "react-leaflet";
import { LatLngBounds, CRS } from "leaflet";
import { Nodes } from "database";
import groundFloor from "@/features/map/assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "@/features/map/assets/00_thelowerlevel2.png";
import firstFloor from "@/features/map/assets/01_thefirstfloor.png";
import secondFloor from "@/features/map/assets/02_thesecondfloor.png";
import thirdFloor from "@/features/map/assets/03_thethirdfloor.png";
import { DirectionsContext, StartContext, EndContext } from "../components";
import "/src/features/map/components/forBeef.css";





export default function BeefletMap(props: { selectedFloor: string }) {
  // Define the bounds of the image in terms of x and y coordinates
  const imageBounds = new LatLngBounds([0, 0], [-3400, 5000]);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const { path } = useContext(DirectionsContext);
  const { start, setStart } = useContext(StartContext);
  const { end, setEnd } = useContext(EndContext);
  const nodePath = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );

  const [clicked, setClicked] = useState(["", false]);

  let paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };

  if (nodePath.length > 0) {
    paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };
    let currentFloor = nodePath[0][0].floor;
    let lastCut = 0;
    for (let i = 1; i < nodePath.length; i++) {
      if (nodePath[i][0].floor != currentFloor) {
        // @ts-expect-error type error (any)
        paths[currentFloor].push(nodePath.slice(lastCut, i));
        currentFloor = nodePath[i][0].floor;
        lastCut = i;
      }
    }
    // @ts-expect-error type error (any)
    paths[currentFloor].push(nodePath.slice(lastCut, nodePath.length));
  }

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("/api/map/nodes");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setNodes(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    fetchNodes();
  }, []);

  const floorID = () => {
    if (props.selectedFloor == groundFloor) {
      return "G";
    } else if (props.selectedFloor == lowerLevel1) {
      return "L1";
    } else if (props.selectedFloor == lowerLevel2) {
      return "L2";
    } else if (props.selectedFloor == firstFloor) {
      return "1";
    } else if (props.selectedFloor == secondFloor) {
      return "2";
    } else if (props.selectedFloor == thirdFloor) {
      return "3";
    }
    return "";
  };
  floorID();
  // Define a custom CRS for x and y coordinates

  return (
    <div className="w-full h-full">
      <MapContainer
        style={{ width: "100%", height: "100vh" }}
        center={[-1700, 2500]} // Center of the image in x and y coordinates
        zoom={-2}
        crs={CRS.Simple} // Use the simple CRS for x and y coordinates
        minZoom={-3} // Adjust as needed
        maxZoom={3} // Adjust as needed
        maxBoundsViscosity={1.0}
        bounceAtZoomLimits={true}
      >
        <ImageOverlay url={props.selectedFloor} bounds={imageBounds} />
        {
          //@ts-expect-error any type error
          paths[floorID()].map((currentPath, i) => (
            <Polyline
              key={i}
                //@ts-expect-error any type error
              positions={currentPath.map((node) => [
                -node[0].ycoord,
                node[0].xcoord,
              ])}
              pathOptions={{ color: "black" }}
              interactive={false}
            ></Polyline>
          ))
        }
        <FeatureGroup>
          {nodes
            .filter((node) => node.floor == floorID())
            .map((node, i) => {
              return (
                <>
                  <Circle
                    key={i}
                    center={[-node.ycoord, node.xcoord]}
                    radius={(() => {
                      if (node.longName == start) {
                        return 10;
                      } else if (node.longName == end) {
                        return 10;
                      }
                      return 7;
                    })()}
                    pathOptions={{
                      color: (() => {
                        if (node.longName == start) {
                          return "blue";
                        } else if (node.longName == end) {
                          return "red";
                        }
                        return "green";
                      })(),
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.openPopup();
                        setClicked([node.nodeID, false]);
                      },
                      mouseout: (e) => {
                        if (clicked[0] == node.nodeID && clicked[1]) {
                          return;
                        }
                        e.target.closePopup();
                      },
                      click: () => {
                        setClicked([node.nodeID, true]);
                      },
                    }}
                  >
                    <Popup>
                      {clicked[0] == node.nodeID && clicked[1] ? (
                        <div>
                          <button
                            className={"styled-button"}
                            onClick={() => setStart(node.longName)}
                          >
                            Start
                          </button>
                          <br />
                          <button
                            className={"styled-button"}
                            onClick={() => setEnd(node.longName)}
                          >
                            End
                          </button>
                          <br />
                          <button className={"styled-button"}>
                            View Requests
                          </button>
                          <br />
                          <button className={"styled-button"}>Request</button>
                        </div>
                      ) : (
                        <div>
                          {"Full name: " + node.longName}
                          <br />
                          {"Short name: " + node.shortName}
                        </div>
                      )}
                    </Popup>
                  </Circle>
                </>
              );
            })}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
