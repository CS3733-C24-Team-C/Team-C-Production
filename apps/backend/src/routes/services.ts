import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { objectsToCSV, readCSV } from "../utils";
import multer from "multer";
import { Prisma } from "database";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
    const requests = await PrismaClient.requests.findMany({
        orderBy: {
            id: "asc",
        },
    });
    res.json(requests);
});

router.get("/download", async function (req: Request, res: Response) {
    try {
        const services = await PrismaClient.requests.findMany();
        const csvData = objectsToCSV(services);
        res.header("Content-Type", "text/csv");
        res.attachment("services.csv");
        res.send(csvData);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

router.post("/", async (req, res) => {
    const {
        maintenanceType, medicineName, medicineDosage, roomTo,
        type, urgency, notes, completionStatus, nodeID, employeeID,
    } = req.body;

    if (roomTo !== '' && roomTo !== undefined) {
        await PrismaClient.requests.create({
            data: {
                maintenanceType: (maintenanceType !== '' && maintenanceType !== undefined) ? maintenanceType : undefined,
                medicineName: (medicineName !== '' && medicineName !== undefined) ? medicineName : undefined,
                medicineDosage: (medicineDosage !== '' && medicineDosage !== undefined) ? medicineDosage : undefined,
                type,
                urgency,
                notes,
                completionStatus,
                room: {
                    connect: {
                        nodeID,
                    },
                },
                employee: {
                    connect: {
                        id: employeeID,
                    },
                },
                newRoomID: {
                    connect: {
                        nodeID: roomTo,
                    }
                }
            },
        });
    } else {
        await PrismaClient.requests.create({
            data: {
                maintenanceType: (maintenanceType !== '' && maintenanceType !== undefined) ? maintenanceType : undefined,
                medicineName: (medicineName !== '' && medicineName !== undefined) ? medicineName : undefined,
                medicineDosage: (medicineDosage !== '' && medicineDosage !== undefined) ? medicineDosage : undefined,
                type,
                urgency,
                notes,
                completionStatus,
                room: {
                    connect: {
                        nodeID,
                    },
                },
                employee: {
                    connect: {
                        id: employeeID,
                    },
                },
            },
        });
    }

    res.status(200).send("Service request received");
});

const storage = multer.diskStorage({
    destination: "tmp/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

router.post("/upload", upload.single("csv-upload"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file was selected");
    }

    if (req.file.mimetype != "text/csv") {
        return res.status(400).send("Invalid file type");
    }

    const newRequests = readCSV(req.file.path);
    newRequests.forEach((request) => {
        request.id = Number(request.id);
        request.employeeID = Number(request.employeeID);
    });
    try {
        await PrismaClient.$transaction(async (tx) => {
            // 1. Get all the existing data and hold them in-memory
            const existingNodes = await tx.nodes.findMany();
            const existingEdges = await tx.edges.findMany();
            const existingEmployees = await tx.employees.findMany();
            // const existingRequests = await tx.requests.findMany();

            // 2. Drop all the tables in the order of foreign key dependencies
            await tx.edges.deleteMany();
            await tx.requests.deleteMany();
            await tx.employees.deleteMany();
            await tx.nodes.deleteMany();

            // 3. Re-seed the database
            await tx.nodes.createMany({
                data: existingNodes,
            });

            await tx.edges.createMany({
                data: existingEdges,
            });

            await tx.employees.createMany({
                data: existingEmployees,
            });

            await tx.requests.createMany({
                data: newRequests as unknown as Prisma.RequestsCreateManyInput,
            });
        });
    } catch (error) {
        console.error("Error processing file upload:", error);
        return res.status(400).send("Bad request");
    }

    res.status(200).send("File uploaded successfully");
});

router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { completionStatus } = req.body;
    await PrismaClient.requests.update({
        where: {
            id,
        },
        data: {
            completionStatus,
        },
    });
    res.status(200).send("Service request updated");
});

export default router;
