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
import { LatLngBounds, CRS, LatLng } from "leaflet";
import { MapContext } from "../components";
import "./forBeef.css";
import "leaflet/dist/leaflet.css";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/features/map/components/Description.tsx";
import { assetToFloor } from "../utils";
import { useAuth0 } from "@auth0/auth0-react";
import { Nodes } from "database";

export default function BeefletMap() {
  // Define the bounds of the image in terms of x and y coordinates
  const imageBounds = new LatLngBounds([0, 0], [-3400, 5000]);
  const {
    nodes,
    edges,
    algorithm,
    selectedFloor,
    path,
    setPath,
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation,
  } = useContext(MapContext);

  const [toggledEdges, setToggledEdges] = useState(false);
  const [toggledNames, setToggledNames] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [zoom, setZoom] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  
  const nodePath = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID)
  );

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
    //console.log(paths);
  }

  const handleSubmit = async (s: string, e: string) => {
    if (s === "" || e === "") {
      return;
    }
    const startNodeId = nodes
      .filter((node) => node["longName"] === s)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["longName"] === e)
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
        //console.log(pathT);
        let pathData =
            "M" +
            pathT[0][0].xcoord +
            "," +
            pathT[0][0].ycoord +
            " ";
        pathT.slice(1, pathT.length).forEach((node) => {
            pathData +=
                "L" +
                (node[0].xcoord +
                    "," +
                    node[0].ycoord +
                    " ");
        });

        const pathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        pathElement.setAttribute("d", pathData);

        const pathLength = pathElement.getTotalLength();

        //console.log(pathLength);
        return { pathData, pathLength };
    };

    const ZoomGetter = () => {
      const map = useMapEvent('zoom', (event) => {
        const zoomLevel = event.target.getZoom();
        // Do something with the zoomLevel
        //console.log('Current zoom level:', zoomLevel);
        setZoom(zoomLevel);
      });
      map;
      // Your component code...
    
      return null; // or your JSX
    };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(); const [lastFloor, setLastFloor] = useState<any>();
  const ResetZoom = (map: { flyTo: (arg0: LatLng, arg1: number) => void; }) => {
    if (lastFloor != selectedFloor) {
      map.flyTo(new LatLng(-1700,2500), -2);
      new LatLng(0,0);
      map;
    }
    console.log("test");
  };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const floor = useMemo(() => {if (map != null) {ResetZoom(map);} return console.log("ran");}, [selectedFloor]);
  floor;

  function MapGetter() {
    setMap(useMap());
    setLastFloor(selectedFloor);
    return null;
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
        <ZoomGetter></ZoomGetter>
        <MapGetter></MapGetter>
        <LayerGroup>
        <ImageOverlay url={selectedFloor} bounds={imageBounds}/>
          {toggledEdges && 
            edges
              .map((edge) => [
                nodes.filter((node) => node.nodeID == edge.startNode),
                nodes.filter((node) => node.nodeID == edge.endNode),
              ])
              .filter(
                (edge) =>
                  edge[0][0].floor == assetToFloor(selectedFloor) &&
                  edge[0][0].floor == edge[1][0].floor
              )
              .map((edge) => (
                <Polyline
                  positions={[
                    [edge[0][0].ycoord * -1, edge[0][0].xcoord],
                    [edge[1][0].ycoord * -1, edge[1][0].xcoord],
                  ]}
                  pathOptions={{
                    color: "black"
                  }}
                ></Polyline>
              ))}
          {paths[assetToFloor(selectedFloor)].map((currentPath, i) => (
              <>
                <SVGOverlay bounds={new LatLngBounds([0, 0], [-3400, 5000])}>
                    <svg viewBox="0 0 5000 3400" key={i}>
                        <path
                            key = {i}
                            id={"movePath" + i.toString()}
                            d={pathToPoints(currentPath).pathData}
                            stroke={(() => {if (colorBlind) {return "purple";} else {return "#0d6102";}})()}
                            fill="none"
                            strokeWidth={12 * Math.max(1-zoom, 1)}
                            strokeLinecap={"round"}
                        />
                        <path
                            key = {i}
                            id={"movePath" + i.toString()}
                            d={pathToPoints(currentPath).pathData}
                            stroke={(() => {if (colorBlind) {return "#5D3A9B";} else {return "green";}})()}
                            fill="none"
                            strokeWidth={6 * Math.max(1-zoom, 1)}
                            strokeLinecap={"round"}
                        />
                        {(() => {
                            const path = pathToPoints(currentPath);
                            const pathLength = path.pathLength;
                            const pathData = path.pathData;
                            const numDots = Math.floor(pathLength / 10);
                            return [...Array(numDots)].map((_, index) => (
                                <>
                                    <circle key={index} r={3 * Math.max(1-zoom, 1)}
                                    fill={(() => {if (colorBlind) {return "#E66100";} else {return "yellow";}})()}>
                                        <animateMotion
                                            dur={Math.floor(numDots / 4).toString() + "s"}
                                            repeatCount="indefinite"
                                            begin={index}
                                            path={pathData}
                                        ></animateMotion>
                                    </circle>
                                </>
                            ));
                        })()}
                    </svg>
                </SVGOverlay>
              </>
          ))}
        </LayerGroup>
          <FeatureGroup>
              {nodes
                  .filter((node) => node.floor == assetToFloor(selectedFloor))
                  .filter((node) => node.nodeType != "HALL")
                  .map((node, i) => {
                      return (
                          <Circle
                              key={i}
                              center={[-node.ycoord, node.xcoord]}
                              fillOpacity={1}
                  radius={(() => {
                    if (node.longName == startLocation) {
                      return 10;
                    } else if (node.longName == endLocation) {
                      return 10;
                    }
                    return 7;
                  })()}
                  pathOptions={{
                    color: "#0E7490",
                    weight: 2,
                    fillColor: (() => {
                      if (node.longName == startLocation) {
                        return "blue";
                      } else if (node.longName == endLocation) {
                        return "yellow";
                      }
                      return "#52BAC2";
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
                    click: async (e) => {
                      if (clicked || e.originalEvent.ctrlKey) {
                        e.target.closePopup();
                        setStartLocation(node.longName);
                        await handleSubmit(node.longName, endLocation);
                        return;
                      }
                      setClicked(true);
                    },
                    contextmenu: async (e) => {
                      //e.target.preventDefault();
                      e.target.closePopup();
                      setEndLocation(node.longName);
                      await handleSubmit(startLocation, node.longName);
                    },
                  }}
                >
                  <Popup className="leaflet-popup-content-wrapper">
                    {clicked ? (
                      <div className={"flex flex-col space-y-2"}>
                        <Button
                          onClick={async () => {
                            setStartLocation(node.longName);
                            await handleSubmit(node.longName, endLocation);
                          }}
                          className={"custom-button"}
                        >
                          Set Start
                        </Button>
                        <Button
                          onClick={async () => {
                            setEndLocation(node.longName);
                            await handleSubmit(startLocation, node.longName);
                          }}
                          className={"custom-button"}
                        >
                          Set End
                        </Button>
                        {isAuthenticated && (
                          <Button
                            className={"custom-button"}
                            onClick={() => navigate("/data/services")}
                          >
                            View Requests
                          </Button>
                        )}
                        {isAuthenticated && (
                          <Button
                            className={"custom-button"}
                            onClick={() => navigate("/services")}
                          >
                            Make Request
                          </Button>
                        )}
                        {isAuthenticated && (
                          <Button className={"custom-button"}>
                            Schedule Move
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {"Full name: " + node.longName}
                        <br />
                        {"Short name: " + node.shortName}
                        <br />
                        {"Node ID: " + node.nodeID}
                        <br />
                        {"Node type: " + node.nodeType}
                      </div>
                    )}
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
        {nodes
          .filter(
            (node) =>
              node.longName == startLocation &&
              node.floor == assetToFloor(selectedFloor)
          )
          .map((node) => (
            <Marker position={[-node.ycoord, node.xcoord]} key={node.nodeID} />
          ))}
        {nodes
          .filter(
            (node) =>
              node.longName == endLocation &&
              node.floor == assetToFloor(selectedFloor)
          )
          .map((node) => (
            <Marker position={[-node.ycoord, node.xcoord]} key={node.nodeID} />
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
            title={"Toggle Colorblind"}
            onClick={() => setColorBlind(!colorBlind)}
            className={"custom-toggle-button"}
            position={"bottomleft"}
          />
        </div>
      </MapContainer>
    </div>
  );
}

/*
dur={Math.floor(numDots / 3).toString() + "s"}

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
 */
