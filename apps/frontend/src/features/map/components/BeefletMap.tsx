import React, { useContext, useState, useMemo } from "react";
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
  SVGOverlay,
  useMapEvent,
  useMap,
} from "react-leaflet";
import L, { LatLngBounds, CRS, LatLng } from "leaflet";
import { MapContext } from "../components";
import "./forBeef.css";
import "leaflet/dist/leaflet.css";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/features/map/components/Description.tsx";
import { assetToFloor, floorToAsset } from "../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { Nodes } from "database";
import ElevatorIcon from "../assets/ElevatorIconBlue.png";
import StairIcon from "../assets/StairIcon.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";

lowerLevel1;
lowerLevel2;
firstFloor;
secondFloor;
thirdFloor;

export default function BeefletMap() {
  // Define the bounds of the image in terms of x and y coordinates
  const imageBounds = new LatLngBounds([0, 0], [-3400, 5000]);
  const {
    nodes,
    edges,
    algorithm,
    selectedFloor,
    setSelectedFloor,
    path,
    setPath,
    //startLocation,
    setStartLocation,
    //endLocation,
    setEndLocation,
    startID,
    setStartID,
    endID,
    setEndID,
    requests,
    center,
  } = useContext(MapContext);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [toggledEdges, setToggledEdges] = useState(false);
  const [toggledNames, setToggledNames] = useState(false);
  const [toggledHallways, setToggledHallways] = useState(false);
  const [toggledNodes, setToggledNodes] = useState(true);
  const [viewRequests, setViewRequests] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [zoom, setZoom] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastFloor, setLastFloor] = useState<any>();

  const nodePath = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );

  class newNodeFloorID {
    node: Nodes;
    floorID: string;

    constructor(node: Nodes, floorID: string) {
      this.node = node;
      this.floorID = floorID;
    }
  }

  let paths = { G: [], L1: [], L2: [], "1": [], "2": [], "3": [] };

  const floorChanges: newNodeFloorID[] = [];
  const prevFloors: newNodeFloorID[] = [];

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
        floorChanges.push(new newNodeFloorID(nodePath[i - 1][0], currentFloor));
        prevFloors.push(
          new newNodeFloorID(nodePath[i][0], nodePath[i - 1][0].floor),
        );
      }
    }
    // @ts-expect-error type error (any)
    paths[currentFloor].push(nodePath.slice(lastCut, nodePath.length));
  }

  const handleSubmit = async (s: string, e: string) => {
    if (s === undefined || e === undefined || s === "" || e === "") {
      return;
    }
    const startNodeId = nodes
      .filter((node) => node["nodeID"] === s)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["nodeID"] === e)
      .map((node) => node.nodeID)[0];
    try {
      const res = await fetch("/api/map/pathfinding", {
        method: "POST",
        body: JSON.stringify({
          startNodeId,
          endNodeId,
          algorithm,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      //setDirections(data.path);
      setPath(data.path);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  function pathToPoints(pathT: Nodes[][]): {
    pathData: string;
    pathLength: number;
  } {
    let pathData = "M" + pathT[0][0].xcoord + "," + pathT[0][0].ycoord + " ";
    pathT.slice(1, pathT.length).forEach((node) => {
      pathData += "L" + (node[0].xcoord + "," + node[0].ycoord + " ");
    });

    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathElement.setAttribute("d", pathData);

    const pathLength = pathElement.getTotalLength();

    return { pathData, pathLength };
  }

  const ZoomGetter = () => {
    useMapEvent("zoom", (event) => {
      const zoomLevel = event.target.getZoom();
      setZoom(zoomLevel);
    });
    return null;
  };

  const ResetZoom = (map: { flyTo: (arg0: LatLng, arg1: number) => void }) => {
    if (lastFloor != selectedFloor) {
      map.flyTo(new LatLng(-1700, 2500), -2);
      new LatLng(0, 0);
      map;
    }
  };

  useMemo(() => {
    if (map != null) {
      ResetZoom(map);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFloor]);

  useMemo(() => {
    if (map != null) {
      map.flyTo(new LatLng(-center[1], center[0]), 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  function MapGetter() {
    setMap(useMap());
    setLastFloor(selectedFloor);
    return null;
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        style={{ width: "100%", height: "100vh", background: "#B1C8DE" }}
        center={[-1700, 2500]} // Center of the image in x and y coordinates
        zoom={-2}
        crs={CRS.Simple} // Use the simple CRS for x and y coordinates
        minZoom={-3} // Adjust as needed
        maxZoom={3} // Adjust as needed
        maxBoundsViscosity={1.0}
        bounceAtZoomLimits={true}
        doubleClickZoom={false}
      >
        <ZoomGetter />
        <MapGetter />
        <LayerGroup>
          <ImageOverlay url={selectedFloor} bounds={imageBounds} />
          {toggledEdges &&
            edges
              .map((edge) => [
                nodes.filter((node) => node.nodeID == edge.startNode),
                nodes.filter((node) => node.nodeID == edge.endNode),
              ])
              .filter(
                (edge) =>
                  edge[0][0].floor == assetToFloor(selectedFloor) &&
                  edge[0][0].floor == edge[1][0].floor,
              )
              .map((edge) => (
                <Polyline
                  positions={[
                    [edge[0][0].ycoord * -1, edge[0][0].xcoord],
                    [edge[1][0].ycoord * -1, edge[1][0].xcoord],
                  ]}
                  pathOptions={{
                    color: "black",
                  }}
                ></Polyline>
              ))}
          <SVGOverlay bounds={new LatLngBounds([0, 0], [-3400, 5000])}>
            <svg viewBox="0 0 5000 3400">
              {paths[assetToFloor(selectedFloor)].map((currentPath, i) => (
                <>
                  <path
                    key={i}
                    id={"movePath" + i.toString()}
                    d={pathToPoints(currentPath).pathData}
                    stroke={(() => {
                      if (colorBlind) {
                        return "purple";
                      } else {
                        return "#0d6102";
                      }
                    })()}
                    fill="none"
                    strokeWidth={12 * (Math.max(1 - zoom, 1 / 2) * 1.5)}
                    strokeLinecap={"round"}
                  />
                  <path
                    key={i}
                    id={"movePath" + i.toString()}
                    d={pathToPoints(currentPath).pathData}
                    stroke={(() => {
                      if (colorBlind) {
                        return "#5D3A9B";
                      } else {
                        return "green";
                      }
                    })()}
                    fill="none"
                    strokeWidth={6 * (Math.max(1 - zoom, 1 / 2) * 1.5)}
                    strokeLinecap={"round"}
                  />
                  <path
                    key={i}
                    id={"movePath" + i.toString()}
                    d={pathToPoints(currentPath).pathData}
                    stroke={(() => {
                      if (colorBlind) {
                        return "orange";
                      } else {
                        return "yellow";
                      }
                    })()}
                    strokeWidth={3 * (Math.max(1 - zoom, 1 / 2) * 1.5)}
                    className="custom-path"
                  />
                </>
              ))}
            </svg>
          </SVGOverlay>
        </LayerGroup>
        <FeatureGroup>
          {toggledNodes &&
            nodes
              .filter((node) => node.floor == assetToFloor(selectedFloor))
              .filter((node) => {
                if (toggledHallways) {
                  return true;
                }
                return node.nodeType != "HALL";
              })
              .map((node, i) => {
                return (
                  <Circle
                    key={i}
                    center={[-node.ycoord, node.xcoord]}
                    fillOpacity={1}
                    radius={(() => {
                      if (node.nodeID == startID) {
                        return 10;
                      } else if (node.nodeID == endID) {
                        return 10;
                      }
                      return 7;
                    })()}
                    pathOptions={{
                      color: "#0E7490",
                      weight: 2,
                      fillColor: (() => {
                        if (node.nodeID == startID) {
                          return "blue";
                        } else if (node.nodeID == endID) {
                          return "yellow";
                        }
                        return "#52BAC2";
                      })(),
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.openPopup();
                        setClicked(false);
                        setViewRequests(false);
                      },
                      mouseout: (e) => {
                        if (clicked) {
                          return;
                        }
                        e.target.closePopup();
                      },
                      click: async (e) => {
                        if (e.originalEvent.ctrlKey) {
                          e.target.closePopup();
                          setStartLocation(node.longName);
                          setStartID(node.nodeID);
                          await handleSubmit(node.nodeID, endID);
                          return;
                        }
                        setClicked(true);
                      },
                      contextmenu: async (e) => {
                        //e.target.preventDefault();
                        e.target.closePopup();
                        setEndLocation(node.longName);
                        setEndID(node.nodeID);
                        await handleSubmit(startID, node.nodeID);
                      },
                    }}
                  >
                    <Popup className="leaflet-popup-content-wrapper">
                      {(() => {
                        const reqNum = requests.filter((req) => req.nodeID === node.nodeID).length;
                        if (viewRequests) {
                          return (
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Employee</th>
                                  <th>Urgency</th>
                                  <th>Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {requests
                                  .filter(
                                    (request) => request.nodeID === node.nodeID,
                                  )
                                  .map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.employeeID}</td>
                                      <td>{item.urgency}</td>
                                      <td>{item.type}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          );
                        } else if (clicked) {
                          return (
                            <div className={"flex flex-col space-y-2"}>
                              <Button
                                onClick={async () => {
                                  setStartLocation(node.longName);
                                  setStartID(node.nodeID);
                                  await handleSubmit(node.nodeID, endID);
                                }}
                                className={"custom-button"}
                              >
                                Set Start
                              </Button>
                              <Button
                                onClick={async () => {
                                  setEndLocation(node.longName);
                                  setEndID(node.nodeID);
                                  await handleSubmit(startID, node.nodeID);
                                }}
                                className={"custom-button"}
                              >
                                Set End
                              </Button>
                              {isAuthenticated && (
                                <Button
                                  className={"custom-button"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewRequests(true);
                                  }}
                                  disabled = {(() => {if (reqNum <= 0) {return true;} else {return false;}})()}
                                >
                                  {(() => {if (reqNum > 0) {return ("View Requests (" + reqNum + ")");} else {return "No Requests";}})()}
                                </Button>
                              )}
                              {isAuthenticated && (
                                <Button
                                  className={"custom-button"}
                                  onClick={() =>
                                    navigate("/services", {
                                      state: { roomID: node.nodeID },
                                    })
                                  }
                                >
                                  Make Request
                                </Button>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div>
                              {"Full name: " + node.longName}
                              <br />
                              {"Short name: " + node.shortName}
                              <br />
                              {"Node ID: " + node.nodeID}
                              <br />
                              {"Node type: " + node.nodeType}
                            </div>
                          );
                        }
                      })()}
                    </Popup>
                    {toggledNames && (
                      <Tooltip
                        permanent={true}
                        className={"customTooltip"}
                        direction={"top"}
                      >
                        {node.longName}
                      </Tooltip>
                    )}
                  </Circle>
                );
              })}
        </FeatureGroup>
        {toggledNodes &&
          nodes
            .filter(
              (node) =>
                node.nodeID == startID &&
                node.floor == assetToFloor(selectedFloor),
            )
            .map((node) => (
              <Marker
                position={[-node.ycoord, node.xcoord]}
                key={node.nodeID}
              />
            ))}
        {nodes
          .filter(
            (node) =>
              node.nodeID == endID && node.floor == assetToFloor(selectedFloor),
          )
          .map((node) => (
            <Marker position={[-node.ycoord, node.xcoord]} key={node.nodeID} />
          ))}
        {floorChanges
          .filter(
            (newFloor) => newFloor.node.floor == assetToFloor(selectedFloor),
          )
          .map((newFloor) => (
            <Marker
              position={[-newFloor.node.ycoord, newFloor.node.xcoord]}
              key={newFloor.node.nodeID}
              icon={L.icon({
                iconUrl:
                  newFloor.node.nodeType == "ELEV" ? ElevatorIcon : StairIcon,
                iconSize: [25, 25], // Adjust size if needed
                iconAnchor: [12.5, 12.5],
                tooltipAnchor: [0, -12.5],
              })}
              eventHandlers={{
                click: async () =>
                  setSelectedFloor(
                    adhocConverterChangePlease(newFloor.floorID),
                  ),
              }}
            >
              <Tooltip
                permanent={true}
                className={"customTooltip"}
                direction={"top"}
              >
                {"Proceed to Floor " + newFloor.floorID}
              </Tooltip>
            </Marker>
          ))}
        {prevFloors
          .filter(
            (newFloor) => newFloor.node.floor == assetToFloor(selectedFloor),
          )
          .map((newFloor) => (
            <Marker
              position={[-newFloor.node.ycoord, newFloor.node.xcoord]}
              key={newFloor.node.nodeID}
              icon={L.icon({
                iconUrl:
                  newFloor.node.nodeType == "ELEV" ? ElevatorIcon : StairIcon,
                iconSize: [25, 25], // Adjust size if needed
                iconAnchor: [12.5, 12.5],
                tooltipAnchor: [0, -12.5],
              })}
              eventHandlers={{
                click: async () =>
                  setSelectedFloor(
                    adhocConverterChangePlease(newFloor.floorID),
                  ),
              }}
            >
              <Tooltip
                permanent={true}
                className={"customTooltip"}
                direction={"top"}
              >
                {"Arrive from Floor " + newFloor.floorID}
              </Tooltip>
            </Marker>
          ))}
        <div>
          <CustomButton
            title={"Toggle Edges"}
            onClick={() => setToggledEdges(!toggledEdges)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Names"}
            onClick={() => setToggledNames(!toggledNames)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Hallways"}
            onClick={() => setToggledHallways(!toggledHallways)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Colorblind"}
            onClick={() => setColorBlind(!colorBlind)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={"Toggle Nodes"}
            onClick={() => setToggledNodes(!toggledNodes)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
          <CustomButton
            title={
              "How To Use Map <br>  Control click node to set as start location <br> Right click node to set as end location"
            }
            className={"instructions"}
            position={"bottomright"}
          />
        </div>
      </MapContainer>
    </div>
  );
}

const adhocConverterChangePlease = (floorID: string) => {
  // @ts-expect-error nope
  return floorToAsset(floorID);
};
