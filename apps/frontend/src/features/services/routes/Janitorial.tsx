import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropDown } from "@/components";
import { Button, TextInput } from "flowbite-react";

const Janitorial = () => {
  const [nameInput, setNameInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<string>("");
  const [statusInput, setStatusInput] = useState("");
  const [employeeInput, setEmployeeInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const [showPriorityDropDown, setShowPriorityDropDown] = useState<boolean>(false);
  const priorities = () => {
    return ["LOWU", "MEDI", "HIGH"];
  };

  const [showStatusDropDown, setShowStatusDropDown] = useState<boolean>(false);
  const statuses = () => {
    return ["UNSG", "ASGN", "PROG", "COMP"];
  };

  const [showEmployeeDropDown, setShowEmployeeDropDown] = useState<boolean>(false);
  const employees = () => {
    return ["Employee 1", "Employee 2", "Employee 3"];
  };

  const navigate = useNavigate();

  function clear() {
    setNameInput("");
    setCommentInput("");
    prioritySelection("");
    statusSelection("");
    employeeSelection("");
  }

  function back() {
    navigate("/services");
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNameInput(e.target.value);
  }

  function handleCommentInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setCommentInput(e.target.value);
  }

  const togglePriorityDropDown = () => {
    setShowPriorityDropDown(!showPriorityDropDown);
  };

  const toggleStatusDropDown = () => {
    setShowStatusDropDown(!showStatusDropDown);
  };

  const toggleEmployeeDropDown = () => {
    setShowEmployeeDropDown(!showEmployeeDropDown);
  };

  const dismissPriorityHandler = (
    e: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (e.currentTarget === e.target) {
      setShowPriorityDropDown(false);
    }
  };

  const dismissStatusHandler = (
    e: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (e.currentTarget === e.target) {
      setShowStatusDropDown(false);
    }
  };

  const dismissEmployeeHandler = (
    e: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (e.currentTarget === e.target) {
      setShowEmployeeDropDown(false);
    }
  };

  const prioritySelection = (priority: string): void => {
    setPriorityInput(priority);
  };

  const statusSelection = (status: string): void => {
    setStatusInput(status);
  };

  const employeeSelection = (employee: string): void => {
    setEmployeeInput(employee);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Fix this form
    const data = {
      type: "JANI",
      urgency: priorityInput,
      notes: commentInput,
      nodeID: "CCONF001L1",
    };
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      navigate("/services");
    } catch (error) {
      console.error("Failed to submit janitorial request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Janitorial Request Form</h1>
      <br></br>
      <div className={"janitorialForm"}>
        <div>
          <p>Name:</p>
          <TextInput
            type="text"
            placeholder="Enter your name here:"
            onChange={handleNameInput}
            value={nameInput}
          />
          <br></br>
          <div>
            {priorityInput
              ? `You selected a ${priorityInput} priority.`
              : "Select a Priority..."}
          </div>
          <Button
            type={"button"}
            className={showPriorityDropDown ? "active" : undefined}
            onClick={(): void => togglePriorityDropDown()}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
              dismissPriorityHandler(e)
            }
          >
            <div>{"Priorities"}</div>
            {showPriorityDropDown && (
              <DropDown
                objects={priorities()}
                showDropDown={false}
                toggleDropDown={(): void => togglePriorityDropDown()}
                objSelection={prioritySelection}
              />
            )}
          </Button>
          <br></br>
          <div>
            {statusInput
              ? `You selected ${statusInput}.`
              : "Select a Status..."}
          </div>
          <Button
            type={"button"}
            className={showStatusDropDown ? "active" : undefined}
            onClick={(): void => toggleStatusDropDown()}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
              dismissStatusHandler(e)
            }
          >
            <div>{"Statuses"}</div>
            {showStatusDropDown && (
              <DropDown
                objects={statuses()}
                showDropDown={false}
                toggleDropDown={(): void => toggleStatusDropDown()}
                objSelection={statusSelection}
              />
            )}
          </Button>
          <br></br>
          <div>
            {employeeInput
              ? `You assigned ${employeeInput} to this request.`
              : "Assign an Employee..."}
          </div>
          <Button
            type={"button"}
            className={showEmployeeDropDown ? "active" : undefined}
            onClick={(): void => toggleEmployeeDropDown()}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
              dismissEmployeeHandler(e)
            }
          >
            <div>{"Employees"}</div>
            {showEmployeeDropDown && (
              <DropDown
                objects={employees()}
                showDropDown={false}
                toggleDropDown={(): void => toggleEmployeeDropDown()}
                objSelection={employeeSelection}
              />
            )}
          </Button>
          <br></br>
          <p>Additional Information:</p>
          <textarea
            className={"comment"}
            onChange={handleCommentInput}
            value={commentInput}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
          <br></br>
          <Button onClick={clear}>Clear</Button>
          <br></br>
          <Button onClick={back}>Back</Button>
        </div>
      </div>
    </form>
  );
};
export { Janitorial };
