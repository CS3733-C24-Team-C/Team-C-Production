import {useContext, useEffect, useState} from "react";
import { DirectionsContext } from "@/features/map/routes/Map.tsx";
import { Nodes } from "database";

export default function Lines(props: {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}) {
  const { path } = useContext(DirectionsContext);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const path2 = path.map((nodeID) =>
    nodes.filter((node) => node.nodeID == nodeID),
  );

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

  function stylePost(c: number, d: string) {
    if (d == "x") {
      return ((c / 5000) * (props.right - props.left)).toString();
    } else {
      return ((c / 3400) * (props.bottom - props.top)).toString();
    }
  }

  function pathToPoints(path: Nodes[][]){
      let pathPoints = "M"+stylePost(path[0][0].xcoord,'x')+','+stylePost(path[0][0].ycoord,'y')+' ';
      path.slice(1,path.length).map((node) => {pathPoints += 'L' + (stylePost(node[0].xcoord,'x') + ',' + stylePost(node[0].ycoord,'y') + ' ');});
      return pathPoints;
  }

  return (
      <>
          <svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg">
              {path.length > 0 && <path id="movePath" d={pathToPoints(path2)} stroke="green" fill="none" strokeWidth={2}/>}
              {path.length > 0 && <path d={pathToPoints(path2)} stroke={"#0b6404"} fill="none" strokeWidth={1}/>}
              {nodes.map((node, i) => (
                  <circle
                      key={i}
                      r={0.5}
                      cy={stylePost(node.ycoord, "y")}
                      cx={stylePost(node.xcoord, "x")}
                      stroke={"black"}
                      onClick={() => alert(node.longName)}
                  />
              ))}
              {path.length > 0 && (() => {
                  let pathLength = 0;
                  if (document.getElementById('movePath')){
                  // @ts-expect-error null exception crap
                  pathLength = document.getElementById('movePath').getTotalLength();}
                  const numDots = Math.floor(pathLength / 1.5);

                  return [...Array(numDots)].map((_, index) => (
                      <circle key={index} r={.5} fill="yellow">
                          <animateMotion dur={30} repeatCount="indefinite" begin={index * .5}>
                              <mpath href="#movePath"/>
                          </animateMotion>
                      </circle>
                  ));
              })()}
          </svg>
      </>
  );
}
