import React,{useEffect,useState} from "react";
import "./MapStyle.css";

export default function CSVDataDisplay(){
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        fetch("/api/map/nodes").then(res => res.json())
            .then(data => {setNodes(data); console.log(data);});
        fetch("/api/map/edges").then(res => res.json())
            .then(data => {setEdges(data); console.log(data);});
    }, []);

    const DisplayDataNodes=nodes.map(
        (info)=>{
            return(
                <tr>
                    <td>{info.nodeID}</td>
                    <td>{info.floor}</td>
                    <td>{info.building}</td>
                </tr>
            );
        }
    );
    const DisplayDataEdges=edges.map(
        (info)=>{
            return(
                <tr>
                    <td>{info.edgeID}</td>
                    <td>{info.startNode}</td>
                    <td>{info.endNode}</td>
                </tr>
            );
        }
    );

    return (
        <div className="row">
        <div className="column">
            <table className="csvText">
                <thead>
                <tr>
                    <th>Node ID</th>
                    <th>Floor</th>
                    <th>Building</th>
                </tr>
                </thead>
                <tbody>
                {DisplayDataNodes}
                </tbody>
            </table>
        </div>
            <div className="column">
            <table className="csvText">
                <thead>
                <tr>
                    <th>Edge ID</th>
                    <th>Start Room</th>
                    <th>End Room</th>
                </tr>
                </thead>
                <tbody>
                {DisplayDataEdges}
                </tbody>
            </table>
        </div>
        </div>
    );
}
