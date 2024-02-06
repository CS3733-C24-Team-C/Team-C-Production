import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropDown, Table } from "@/components";
import { Button } from "flowbite-react";

const ServiceRequest = () => {
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setServiceRequests(data);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      }
    };
    fetchServiceRequests();
  }, []);

  const [showRoomDropDown, setShowRoomDropDown] = useState<boolean>(false);
  const [showRequestDropDown, setShowRequestDropDown] =
    useState<boolean>(false);
  const [selectRoom, setSelectRoom] = useState<string>("");
  const rooms = () => {
    return ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"];
  };
  const [selectRequest, setSelectRequest] = useState<string>("");
  const requests = () => {
    return [
      "Janitorial",
      "Mechanical",
      "Medicine",
      "Consultation",
      "Patient Relocation",
      "Custom",
    ];
  };
  const navigate = useNavigate();

  const toggleRoomDropDown = () => {
    setShowRoomDropDown(!showRoomDropDown);
  };

  const toggleRequestDropDown = () => {
    setShowRequestDropDown(!showRequestDropDown);
  };

  const dismissRoomHandler = (
    event: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (event.currentTarget === event.target) {
      setShowRoomDropDown(false);
    }
  };

  const dismissRequestHandler = (
    event: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (event.currentTarget === event.target) {
      setShowRequestDropDown(false);
    }
  };

  const roomSelection = (room: string): void => {
    setSelectRoom(room);
  };

  const requestSelection = (request: string): void => {
    setSelectRequest(request);
  };

  function submit() {
    if (selectRoom !== "" && selectRequest !== "") {
      const [room] = selectRoom;
      const [request] = selectRequest;
      console.log(room);
      console.log(request);
    }

    if (selectRequest == "Janitorial") {
      navigate("/services/janitorial");
    }
  }

  function back() {
    navigate("/");
  }

  return (
    <div className={"dropdown"}>
      <h1>Submit a Service Request</h1>
      <br></br>
      <div>
        {selectRoom ? `You selected ${selectRoom}.` : "Select a Room..."}
      </div>
      <Button
        className={showRoomDropDown ? "active" : undefined}
        onClick={(): void => toggleRoomDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissRoomHandler(e)
        }
      >
        <div>{"Rooms"}</div>
        {showRoomDropDown && (
          <DropDown
            objects={rooms()}
            showDropDown={false}
            toggleDropDown={(): void => toggleRoomDropDown()}
            objSelection={roomSelection}
          />
        )}
      </Button>
      <br></br>
      <div>
        {selectRequest
          ? `You selected a ${selectRequest} request.`
          : "Select a Request..."}
      </div>
      <Button
        className={showRequestDropDown ? "active" : undefined}
        onClick={(): void => toggleRequestDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissRequestHandler(e)
        }
      >
        <div>{"Requests"}</div>
        {showRequestDropDown && (
          <DropDown
            objects={requests()}
            showDropDown={false}
            toggleDropDown={(): void => toggleRequestDropDown()}
            objSelection={requestSelection}
          />
        )}
      </Button>
      <br></br>
      <div>
        <Button onClick={submit}>Submit</Button>
        <br></br>
        <Button onClick={back}>Back</Button>
      </div>
      <Table data={serviceRequests} />
    </div>
  );
};

export { ServiceRequest };
