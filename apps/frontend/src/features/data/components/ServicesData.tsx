import React, { useEffect, useState } from "react";
import { DataTable, DataTableColumnHeader } from "@/components";
import {
  FileInput,
  Label,
  Button,
  Select,
  Checkbox,
  Dropdown,
} from "flowbite-react";
import { downloadCSV } from "../utils";
import { RequestStatus, Requests } from "database";
import { ColumnDef } from "@tanstack/react-table";
import { MdMoreHoriz } from "react-icons/md";
import { FaDownload, FaTrash } from "react-icons/fa";
// import { RxCaretSort } from "react-icons/rx";

const ServicesData = () => {
  const [services, setServices] = useState<Requests[]>([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/services/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(res.statusText);
      setFile("");
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file. Please try again.");
    }
  };

  const changeCompletionStatus = async (
    id: number,
    newStatus: RequestStatus
  ) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completionStatus: newStatus }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const updatedServices = services.map((service) =>
        service.id === id
          ? { ...service, completionStatus: newStatus }
          : service
      );
      setServices(updatedServices);
    } catch (error) {
      console.error("Failed to update service request:", error);
    }
  };

  return (
    <>
      <form
        action="/api/services/upload"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="mb-2 block">
          <Label htmlFor="csv-upload" value="Upload new CSV Data:" />
        </div>
        <FileInput
          className="w-96"
          id="csv-upload"
          name="csv-upload"
          accept="text/csv"
          value={file}
          helperText="CSV files only."
          onChange={(e) => setFile(e.target.value)}
        />
        <br />
        <Button type="submit">Upload File</Button>
      </form>

      <div className="mt-4 flex space-x-4 w-96">
        <Button onClick={() => downloadCSV("/api/services/download")}>
          Download Service Requests CSV
        </Button>
      </div>

      <div className="flex">
        <DataTable
          columns={requestsTableColumns}
          data={services}
          searchColumn="id"
        />
        <div>
          <h6 className="font-bold mb-2">Completion Status</h6>
          <div className="flex flex-col gap-2 ml-2">
            {services.map((service) => (
              <Select
                id="status"
                sizing="sm"
                required
                key={service.id}
                defaultValue={service.completionStatus}
                onChange={(e) =>
                  changeCompletionStatus(
                    service.id,
                    e.target.value as RequestStatus
                  )
                }
              >
                <option value="UNASSIGNED">Unassigned</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const requestsTableColumns: ColumnDef<Requests>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && undefined)
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          table.toggleAllPageRowsSelected(event.target.checked);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          row.toggleSelected(event.target.checked);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "nodeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room ID" />
    ),
    cell: ({ row }) => row.getValue("nodeID"),
  },
  {
    accessorKey: "employeeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => row.getValue("employeeID"),
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Urgency" />
    ),
    cell: ({ row }) => row.getValue("urgency"),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => row.getValue("type"),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => row.getValue("notes"),
  },
  {
    accessorKey: "completionStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completion Status" />
    ),
    cell: ({ row }) => row.getValue("completionStatus"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <Dropdown
          label="Actions"
          renderTrigger={() => (
            <Button outline pill size="xs">
              <MdMoreHoriz className="h-4 w-4" />
            </Button>
          )}
        >
          <Dropdown.Item icon={FaDownload}>Download track</Dropdown.Item>
          <Dropdown.Item icon={FaTrash}>Delete track</Dropdown.Item>
        </Dropdown>
      );
    },
  },
];

export { ServicesData };
