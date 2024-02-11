import React, { useContext, useEffect, useState } from "react";
import {
    MapContainer,
    ImageOverlay,
    Circle,
    Polyline,
    Popup,
    FeatureGroup,
    Marker,
    LayerGroup,
    Tooltip,
} from "react-leaflet";
import { LatLngBounds, CRS } from "leaflet";
import {Edges, Nodes} from "database";
import groundFloor from "@/features/map/assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "@/features/map/assets/00_thelowerlevel2.png";
import firstFloor from "@/features/map/assets/01_thefirstfloor.png";
import secondFloor from "@/features/map/assets/02_thesecondfloor.png";
import thirdFloor from "@/features/map/assets/03_thethirdfloor.png";
import { DirectionsContext, StartContext, EndContext } from "../components";
import "/src/features/map/components/forBeef.css";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/features/map/components/Description.tsx";

export default function BeefletMap(props: { selectedFloor: string }) {
  // Define the bounds of the image in terms of x and y coordinates
  const imageBounds = new LatLngBounds([0, 0], [-3400, 5000]);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [edges, setEdges] = useState<Edges[]>([]);
  const { path } = useContext(DirectionsContext);
  const { start, setStart } = useContext(StartContext);
  const { end, setEnd } = useContext(EndContext);
  const nodePath = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );

  const [toggled, setToggled] = useState(false);

  const navigate = useNavigate();

  const [clicked, setClicked] = useState(false);

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
        const fetchEdges = async () => {
            try {
                const res = await fetch("/api/map/edges");
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                setEdges(data);
            } catch (error) {
                console.error("Failed to fetch edges:", error);
            }
        };
        fetchNodes();
        fetchEdges();
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

  function nav(dest: string) {
      navigate(dest);
  }

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
        doubleClickZoom={false}
      >
        <ImageOverlay url={props.selectedFloor} bounds={imageBounds} />
        <LayerGroup>
            {toggled &&
                edges
                    .map((edge) => [
                        nodes.filter((node) => node.nodeID == edge.startNode),
                        nodes.filter((node) => node.nodeID == edge.endNode),
                    ])
                    .filter(
                        (edge) =>
                            edge[0][0].floor == floorID() &&
                            edge[0][0].floor == edge[1][0].floor,
                    )
                    .map((edge) => (
                        <Polyline positions={[[edge[0][0].ycoord * -1, edge[0][0].xcoord],
                            [edge[1][0].ycoord * -1, edge[1][0].xcoord]]}></Polyline>
                    ))}
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
                        weight={8}
                    />
                ))
            }
        </LayerGroup>
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
                        setClicked(false);
                      },
                      mouseout: (e) => {
                        if (clicked) {
                          return;
                        }
                        e.target.closePopup();
                      },
                      click: (e) => {
                        if (clicked || e.originalEvent.ctrlKey) {
                            e.target.closePopup();
                            setStart(node.longName);
                            return;
                        }
                        setClicked(true);
                      },
                      contextmenu: (e) => {
                          //e.target.preventDefault();
                          e.target.closePopup();
                          setEnd(node.longName);
                      },
                    }}
                    fillOpacity={.8}
                  >
                    <Popup className="leaflet-popup-content-wrapper">
                      {clicked ? (
                          <div className={"flex flex-col space-y-2"}>
                              <Button
                                  onClick={() => setStart(node.longName)}
                                  className={"custom-button"}>
                                  Set Start
                              </Button>
                              <Button
                                  onClick={() => setEnd(node.longName)}
                                  className={"custom-button"}>
                                  Set End
                              </Button>
                              <Button className={"custom-button"} onClick={() => nav("/data/services")}>
                                  View Requests
                              </Button>
                              <Button className={"custom-button"} onClick={() => nav("/services")}>Make Request</Button>
                              <Button className={"custom-button"}>Schedule Move</Button>
                          </div>
                      ) : (
                          <div>
                          {"Full name: " + node.longName}
                          <br />
                          {"Short name: " + node.shortName}
                        </div>
                      )}
                    </Popup>
                    {toggled && <Tooltip permanent={true} className={"customTooltip"} direction={"top"}>{node.longName}</Tooltip>}
                  </Circle>
                </>
              );
            })}
        </FeatureGroup>
          {nodes.filter((node) => node.longName == start && node.floor == floorID()).map((node) => (
              <Marker position={[-node.ycoord, node.xcoord]}></Marker>
          ))}
          {nodes.filter((node) => node.longName == end && node.floor == floorID()).map((node) => (
              <Marker position={[-node.ycoord, node.xcoord]}></Marker>
          ))}
          <CustomButton
              title={"Toggle"}
              onClick={() => setToggled(!toggled)}
              className={"custom-toggle-button"}
              position={"bottomleft"}
          />
      </MapContainer>
    </div>
  );
}
