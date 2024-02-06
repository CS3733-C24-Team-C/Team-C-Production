//useContext
import React, { useContext, useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import { Nodes } from "database";
import "./LocationSearch.css";
import { DirectionsContext } from "@/features/map/routes/Map.tsx";

const LocationSearch = () => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [directions, setDirections] = useState<string[]>([]);
  const newDirections = directions.map((ID) =>
    nodes.filter((node) => node["nodeID"] === ID),
  );

  const { path, setPath } = useContext(DirectionsContext);

  const locations: { nodeID: string; longName: string }[] = nodes.map(
    (node) => {
      return { nodeID: node.nodeID, longName: node.longName };
    },
  );

  function angleBetweenVectors(
    v1: { x: number; y: number },
    v2: { x: number; y: number },
  ): number {
    // Calculate the angle in radians using the arctangent function
    const angleRad = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);

    // Convert angle to degrees
    let angleDegrees = angleRad * (180 / Math.PI);

    // Adjust the angle to be in the range from -180 to 180 degrees
    if (angleDegrees > 180) {
      angleDegrees -= 360;
    } else if (angleDegrees < -180) {
      angleDegrees += 360;
    }

    return angleDegrees;
  }

  function turnDirection(index: number) {
    let currDirection = null;
    let prevDirection = null;
    let nextDirection = null;

    switch (index) {
      case 0:
        return "Start at ";
      case newDirections.length - 1:
        return "Arrive at ";
      default:
        if (
          newDirections.length > 0 &&
          index > 0 &&
          index < newDirections.length
        ) {
          prevDirection = newDirections[index - 1][0];
          currDirection = newDirections[index][0];
          nextDirection = newDirections[index + 1][0];

          if (currDirection && nextDirection && prevDirection) {
            const vector1 = {
              x: currDirection.xcoord - prevDirection.xcoord,
              y: currDirection.ycoord - prevDirection.ycoord,
            };
            const vector2 = {
              x: nextDirection.xcoord - currDirection.xcoord,
              y: nextDirection.ycoord - currDirection.ycoord,
            };

            const angle = angleBetweenVectors(vector1, vector2);

            // Use crossProductValue to determine left or right turn
            if (angle < -30) {
              return "Turn left towards ";
            } else if (angle >= -30 && angle < -15) {
              return "Bear left towards ";
            } else if (angle >= -15 && angle < 15) {
              return "Head straight towards ";
            } else if (angle >= 15 && angle < 30) {
              return "Bear right towards ";
            } else if (angle >= 30) {
              return "Turn right towards ";
            } else {
              return "idk lmfao";
            }
          }
        }
    }
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startNodeId = nodes
      .filter((node) => node["longName"] === startLocation)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["longName"] === endLocation)
      .map((node) => node.nodeID)[0];
    try {
      const res = await fetch("/api/map/pathfinding", {
        method: "POST",
        body: JSON.stringify({
          startNodeId,
          endNodeId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setDirections(data.path);
      console.log(newDirections);
      setPath(data.path);
      console.log(path);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  return (
    <>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <Label
            id="startLocation"
            htmlFor="startLocation"
            value="Enter starting point"
          />
          <TextInput
            id="startLocation"
            type="text"
            placeholder="Medical Records Conference Room Floor L1"
            required
            rightIcon={CiSearch}
            value={startLocation}
            onChange={(e) => {
              setStartLocation(e.target.value);
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    ),
                );
              } else {
                setStartSuggestions([]);
              }
            }}
          />
          {startSuggestions.length > 0 && (
            <div className="absolute bg-white w-full border z-10 rounded-md shadow-lg">
              {startSuggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStartLocation(s);
                    setStartSuggestions([]);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  {startSuggestions}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <Label htmlFor="endLocation" value="Enter destination" />
          <TextInput
            id="endLocation"
            type="text"
            placeholder="Nuclear Medicine Floor L1"
            required
            rightIcon={CiSearch}
            value={endLocation}
            onChange={(e) => {
              setEndLocation(e.target.value);
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    ),
                );
              } else {
                setEndSuggestions([]);
              }
            }}
          />
          {endSuggestions.length > 0 && (
            <div className="absolute bg-white w-full border  z-10 rounded-md shadow-lg overflow-hidden">
              {endSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={() => {
                    setEndLocation(suggestion);
                    setEndSuggestions([]);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <div>
        <table>
          <tbody style={{ fontSize: "12px" }}>
            {newDirections.map((row, i: number) => (
              <tr key={i}>
                <td>
                  {i < newDirections.length && turnDirection(i)}
                  {row[0]?.longName}{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export { LocationSearch };
