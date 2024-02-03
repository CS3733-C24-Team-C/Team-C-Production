import React, { useContext, useEffect, useState } from "react";
import "./nodes.css";
import { Nodes } from "database";
import { DirectionsContext } from "@/features/map/routes/Map.tsx";

/**
 *
 * @param props
 * @constructor
 */

export default function Nodes(props: {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}) {
  const left = props.left;
  const top = props.top;
  const right = props.right;
  const bottom = props.bottom;
  const scaleX = 5000;
  const scaleY = 3400;
  const { path } = useContext(DirectionsContext);

  const [nodes, setNodes] = useState<Nodes[]>([]);

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

  function stylePost(x: number, y: number) {
    return {
      top: ((y / scaleY) * (bottom - top)).toString() + "px",
      left: ((x / scaleX) * (right - left)).toString() + "px",
    };
  }

  return (
    <>
      {nodes.map((row, i) => (
        <div key={i}>
          <span className="dot" style={stylePost(row.xcoord, row.ycoord)}>
            {row.nodeID}
          </span>
        </div>
      ))}
      {path.length > 0 &&
        path
          .map((ID) => nodes.filter((node) => node.nodeID == ID))
          .map((node, i) => (
            <div key={i}>
              <span
                className="dot2"
                style={stylePost(node[0].xcoord, node[0].ycoord)}
              >
                {node[0].nodeID}
              </span>
            </div>
          ))}
    </>
  );
}

/*

{(path.length > 0) && path.map((ID) => nodes.filter((node) => node.nodeID == ID))
              .map(() => draw())}

{path.length > 0 &&
              path
                  .map((ID) => nodes.filter((node) => node.nodeID == ID))
                  .map((node, i) => (
                      <div key={i}>
              <span
                  className="dot2"
                  style={stylePost(node[0].xcoord, node[0].ycoord)}
              ></span>
                      </div>
                  ))}

function drawPathLine(x1: number, y1: number, x2: number, y2: number, divisions: number){
      x1 = ((x1 / scaleX) * (right - left));
      y1 = ((y1 / scaleX) * (right - left));
      x2 = ((x1 / scaleX) * (right - left));
      y2 = ((y2 / scaleX) * (right - left));
      let points = [[0]];
      const travelX = (x2-x1)/divisions;
      const travely = (y2-y1)/divisions;
      for (let i = 0; i <= divisions; i++){
          points[i] = [x1 + (i * travelX), y1 + (i * travely)];
      }
      return (
          points.map((XY) =>
          <div>
              <span className="dot2"
                    style={stylePost(XY[0], XY[1])}>
              </span>
          </div>)
      );
  }
 */
