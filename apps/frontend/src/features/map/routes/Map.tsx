import { useState } from "react";
import groundFloor from "../assets/00_thegroundfloor.png";
import { Sidebar, MapDisplay, DirectionsContext } from "../components";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState(groundFloor);
  const [path, setPath] = useState<string[]>([]);

  // const mapStyles = {
  //   width: "100%",
  //   height: "100vh",
  // };

  // useEffect(() => {
  //   L.map("beeflet", {
  //     center: [52, 4],
  //     zoom: 4,
  //     layers: [
  //       L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  //         attribution:
  //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //       }),
  //     ],
  //   });
  // }, []);

  return (
    <DirectionsContext.Provider value={{ path, setPath }}>
      <div className="h-screen flex overflow-hidden">
        <Sidebar setSelectedFloor={setSelectedFloor} />
        <div className="flex-1 overflow-auto">
          <div className="hidden">
            <MapDisplay selectedFloor={selectedFloor} />
          </div>
          <div className="w-full h-full">
            <MapContainer
              style={{ width: "100%", height: "100vh" }}
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </DirectionsContext.Provider>
  );
};

export { Map };
