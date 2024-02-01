import { useState } from "react";

import groundFloor from "../assets/00_thegroundfloor.png";
import lowerLevel1 from "../assets/00_thelowerlevel1.png";
import lowerLevel2 from "../assets/00_thelowerlevel2.png";
import firstFloor from "../assets/01_thefirstfloor.png";
import secondFloor from "../assets/02_thesecondfloor.png";
import thirdFloor from "../assets/03_thethirdfloor.png";
import { MenuBar, AutofillInput } from "@/components";

const Map = () => {
  const [selectedFloor, setSelectedFloor] = useState("");

  return (
    <>
      <div>
        <MenuBar></MenuBar>
        <AutofillInput></AutofillInput>
        <select
          name="mapFloors"
          id="mapFloors"
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          <option value={groundFloor}>Ground Floor</option>
          <option value={lowerLevel1}>Lower Level 1</option>
          <option value={lowerLevel2}>Lower Level 2</option>
          <option value={firstFloor}>First Floor</option>
          <option value={secondFloor}>Second Floor</option>
          <option value={thirdFloor}>Third Floor</option>
        </select>
      </div>
      <img
        src={selectedFloor}
        alt={"Floor image"}
        width={"1000"}
        height={"auto"}
      />
    </>
  );
};

export { Map };
