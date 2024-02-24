import React, {createContext, useContext, useEffect, useState} from "react";
import {DataTable, DataTableColumnHeader} from "@/components";
import {
    FileInput,
    Label,
    Button,
    Select,
    Checkbox,
    Card,
} from "flowbite-react";
import {downloadCSV} from "../utils";
import {RequestStatus, Requests} from "database";
import {ColumnDef, Row} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import {PieChart, DonutChart} from "@/components";

const ServicesContext = createContext<{
    services: Requests[];
    setServices: React.Dispatch<React.SetStateAction<Requests[]>>;
}>({
    services: [],
    // eslint-disable-next-line no-empty-function
    setServices: () => {
    },
});

const ServicesData = () => {
    const [services, setServices] = useState<Requests[]>([]);
    const [file, setFile] = useState("");
    const navigate = useNavigate();

    const [pieChartServices, setPieChartServices] = useState<Requests[]>([]);
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<
        string | null
    >(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();

                const employeesRes = await fetch("/api/employees");
                if (!employeesRes.ok) throw new Error(employeesRes.statusText);
                const employeesData = await employeesRes.json();

                const filteredDataForPieChart = selectedEmployeeType
                    ? data.filter((service: { employeeID: string }) => {
                        const employee = employeesData.find(
                            (emp: { id: string }) => emp.id === service.employeeID,
                        );
                        return employee?.role === selectedEmployeeType;
                    })
                    : data;

                setServices(data);
                setPieChartServices(filteredDataForPieChart);
            } catch (error) {
                console.error("Failed to fetch nodes:", error);
            }
        };
        fetchServices();
    }, [selectedEmployeeType]);

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

    const typeLabelsMap: Record<string, string> = {
        JANI: "Janitorial",
        MECH: "Mechanical Maintenance",
        MEDI: "Medicine Delivery",
        RELC: "Patient Relocation",
        CONS: "Patient Consultation",
        CUST: "Customer Service",
    };

    const completionStatusLabelsMap: Record<string, string> = {
        UNASSIGNED: "Unassigned",
        ASSIGNED: "Assigned",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
    };

    const totalRequests = pieChartServices.length;

    const requestTypesMap = pieChartServices.reduce(
        (map, service) => {
            const type = service.type;
            const userFriendlyLabel = typeLabelsMap[type];
            map[userFriendlyLabel] = (map[userFriendlyLabel] || 0) + 1;
            return map;
        },
        {} as Record<string, number>,
    );
    const seriesPie = Object.values(requestTypesMap).map((count) =>
        Number(((count / totalRequests) * 100).toFixed(2)),
    );
    const labelsPie = Object.keys(requestTypesMap);


    const completionStatusMap = pieChartServices.reduce(
        (map, service) => {
            const status = service.completionStatus;
            const userFriendlyLabel = completionStatusLabelsMap[status];
            map[userFriendlyLabel] = (map[userFriendlyLabel] || 0) + 1;
            return map;
        },
        {} as Record<string, number>,
    );

    const seriesDonut = Object.values(completionStatusMap).map((count) =>
        Number(((count / totalRequests) * 100).toFixed(2)),
    );
    const labelsDonut = Object.keys(completionStatusMap);

    return (
        <>
            <div className="px-16 py-8">
                <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
                    <div className="flex justify-between space-x-8">
                        <div>
                            <form
                                action="/api/services/upload"
                                method="post"
                                encType="multipart/form-data"
                                onSubmit={handleSubmit}
                            >
                                <div className="mb-2 block">
                                    <Label htmlFor="csv-upload" value="Upload new CSV Data:"/>
                                </div>
                                <FileInput
                                    className="w-50vw"
                                    id="csv-upload"
                                    name="csv-upload"
                                    accept="text/csv"
                                    value={file}
                                    helperText="CSV files only."
                                    onChange={(e) => setFile(e.target.value)}
                                />
                                <br/>
                                <Button type="submit">Upload File</Button>
                            </form>
                            <div className="mt-4 flex space-x-4 w-96">
                                <Button
                                    className="text-sm md:text-base" // Use responsive font size
                                    onClick={() => downloadCSV("/api/services/download")}>
                                    Download Service Requests CSV
                                </Button>
                            </div>
                        </div>
                        <PieChart
                            series={seriesPie}
                            labels={labelsPie}
                            onChangeEmployeeType={setSelectedEmployeeType}
                        />
                        <DonutChart
                            series={seriesDonut}
                            labels={labelsDonut}
                        />
                    </div>
                </Card>
            </div>

            <div className="flex flex-col px-16 py-8">
                <ServicesContext.Provider value={{services, setServices}}>
                    <DataTable
                        columns={requestsTableColumns}
                        data={services}
                        searchColumn="employeeID"
                        onAddRow={() => navigate("/services")}
                    />
                </ServicesContext.Provider>
            </div>
        </>
    );
};

const requestsTableColumns: ColumnDef<Requests>[] = [
    {
        id: "select",
        header: ({table}) => (
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
        cell: ({row}) => (
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
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell: ({row}) => row.getValue("id"),
    },
    {
        accessorKey: "nodeID",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Room ID"/>
        ),
        cell: ({row}) => row.getValue("nodeID"),
    },
    {
        accessorKey: "employeeID",
        accessorFn: (row) => row.employeeID?.toString(),
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Employee ID"/>
        ),
        cell: ({row}) => row.getValue("employeeID"),
    },
    {
        accessorKey: "urgency",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Urgency"/>
        ),
        cell: ({row}) => row.getValue("urgency"),
    },
    {
        accessorKey: "type",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Type"/>
        ),
        cell: ({row}) => row.getValue("type"),
    },
    {
        accessorKey: "notes",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Notes"/>
        ),
        cell: ({row}) => row.getValue("notes"),
    },
    {
        accessorKey: "medicineName",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Medicine Name"/>
        ),
        cell: ({row}) => row.getValue("medicineName"),
    },
    {
        accessorKey: "medicineDosage",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Medicine Dosage"/>
        ),
        cell: ({row}) => row.getValue("medicineDosage"),
    },
    {
        accessorKey: "maintenanceType",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Maintenance Type"/>
        ),
        cell: ({row}) => row.getValue("maintenanceType"),
    },
    {
        accessorKey: "roomTo",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Room To"/>
        ),
        cell: ({row}) => row.getValue("roomTo"),
    },
    {
        accessorKey: "hazardousWaste",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Hazardous Waste"/>
        ),
        // undefind -> not show anything, true -> Yes, false -> No
        cell: ({row}) =>
            row.getValue("hazardousWaste") === null
                ? row.getValue("hazardousWaste")
                : row.getValue("hazardousWaste")
                    ? "Yes"
                    : "No",
    },
    {
        accessorKey: "department",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Department"/>
        ),
        cell: ({row}) => row.getValue("department"),
    },
    {
        accessorKey: "completionStatus",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Completion Status"/>
        ),
        cell: ({row}) => row.getValue("completionStatus"),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            return <ServicesActions row={row}/>;
        },
    },
];

type ServicesActionsProps = {
    row: Row<Requests>;
};

const ServicesActions = ({row}: ServicesActionsProps) => {
    const {services, setServices} = useContext(ServicesContext);

    const changeCompletionStatus = async (
        id: number,
        newStatus: RequestStatus,
    ) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({completionStatus: newStatus}),
            });
            if (!res.ok) throw new Error(res.statusText);
            const updatedServices = services.map((service) =>
                service.id === id
                    ? {...service, completionStatus: newStatus}
                    : service,
            );
            setServices(updatedServices);
        } catch (error) {
            alert("Failed to update completion status. Please try again.");
        }
    };

    return (
        <Select
            id="status"
            sizing="sm"
            required
            className="w-32"
            key={row.original.id}
            defaultValue={row.original.completionStatus}
            onChange={(e) =>
                changeCompletionStatus(row.original.id, e.target.value as RequestStatus)
            }
        >
            <option value="UNASSIGNED">Unassigned</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
        </Select>
    );
};

export {ServicesData};
