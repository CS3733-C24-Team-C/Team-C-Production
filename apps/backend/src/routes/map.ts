import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import multer from "multer";
import JSZip from "jszip";
import fs from "fs";
import { readCSV, objectsToCSV } from "../utils";
import { Prisma } from "database";
import {
  AStarPathfindingStrategy,
  BFSPathfindingStrategy,
  DFSPathfindingStrategy,
  GraphSingleton,
  PathfindingContext,
} from "../pathfinding";

const router: Router = express.Router();

router.get("/nodes", async function (req: Request, res: Response) {
  const nodes = await PrismaClient.nodes.findMany();
  res.json(nodes);
});

const paginatedDataMiddlewareBuilder = ({
  model,
  searchField,
  defaultPage,
  defaultPerPage,
  defaultSortBy,
  defaultSearchQuery,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  searchField: string;
  defaultPage: number;
  defaultPerPage: number;
  defaultSortBy: string;
  defaultSearchQuery: string;
}) => {
  return async (req: Request, res: Response) => {
    try {
      // Pagination
      const page = Number(req.query.page) || defaultPage;
      const perPage = Number(req.query.perPage) || defaultPerPage;

      // Sorting
      const sortBy = req.query.sortBy
        ? String(req.query.sortBy)
        : defaultSortBy;
      const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

      // Filtering/Searching
      const searchQuery = req.query.searchQuery
        ? String(req.query.searchQuery)
        : defaultSearchQuery;

      if (page < 1 || perPage < 1) {
        return res.status(400).send("Invalid page or perPage");
      }

      const totalRecords = await model.count({
        where: {
          [searchField]: {
            contains: searchQuery,
          },
        },
      });
      const totalPages = Math.ceil(totalRecords / perPage);

      if (page > totalPages) {
        return res.status(400).send("Invalid page number");
      }

      const data = await model.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: {
          [searchField]: {
            contains: searchQuery,
          },
        },
      });

      res.json({
        data,
        pagination: {
          totalRecords,
          totalPages,
          perPage,
          previousPage: page - 1 < 1 ? null : page - 1,
          currentPage: page,
          nextPage: page + 1 > totalPages ? null : page + 1,
        },
      });
    } catch (error) {
      console.error(`Error fetching data:`, error);
      res.status(400).send(error);
    }
  };
};

router.get(
  "/paginatedNodes",
  paginatedDataMiddlewareBuilder({
    model: PrismaClient.nodes,
    searchField: "longName",
    defaultPage: 1,
    defaultPerPage: 50,
    defaultSortBy: "nodeID",
    defaultSearchQuery: "",
  })
);

router.get("/edges", async function (req: Request, res: Response) {
  const edges = await PrismaClient.edges.findMany();
  res.json(edges);
});

router.get(
  "/paginatedEdges",
  paginatedDataMiddlewareBuilder({
    model: PrismaClient.edges,
    searchField: "edgeID",
    defaultPage: 1,
    defaultPerPage: 50,
    defaultSortBy: "edgeID",
    defaultSearchQuery: "",
  })
);

const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/upload/nodes", upload.single("csv-upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
  }
  const newNodes = readCSV(req.file.path);
  newNodes.forEach((node) => {
    node.xcoord = Number(node.xcoord);
    node.ycoord = Number(node.ycoord);
  });
  try {
    await PrismaClient.$transaction(async (tx) => {
      // 1. Get all the existing data and hold them in-memory
      // const existingNodes = await tx.nodes.findMany();
      const existingEdges = await tx.edges.findMany();
      const existingEmployees = await tx.employees.findMany();
      const existingEmployeeJobs = await tx.employeeJobs.findMany();
      const existingRequests = await tx.requests.findMany();

      // 2. Drop all the tables in the order of foreign key dependencies
      await tx.edges.deleteMany();
      await tx.requests.deleteMany();
      await tx.employeeJobs.deleteMany();
      await tx.employees.deleteMany();
      await tx.nodes.deleteMany();

      // 3. Re-seed the database
      await tx.nodes.createMany({
        data: newNodes as unknown as Prisma.NodesCreateManyInput,
      });

      await tx.edges.createMany({
        data: existingEdges,
      });

      await tx.employees.createMany({
        data: existingEmployees,
      });

      await tx.employeeJobs.createMany({
        data: existingEmployeeJobs,
      });

      await tx.requests.createMany({
        data: existingRequests,
      });
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(400).send("Bad request");
  }

  res.status(200).send("File uploaded successfully");
});

router.post("/upload/edges", upload.single("csv-upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was selected");
  }

  if (req.file.mimetype != "text/csv") {
    return res.status(400).send("Invalid file type");
  }
  const newEdges = readCSV(req.file.path);
  newEdges.forEach((edge) => {
    edge.weight = Number(edge.weight);
  });
  try {
    await PrismaClient.$transaction(async (tx) => {
      // 1. Get all the existing data and hold them in-memory
      // const existingNodes = await tx.nodes.findMany();
      const existingNodes = await tx.nodes.findMany();
      const existingEmployees = await tx.employees.findMany();
      const existingEmployeeJobs = await tx.employeeJobs.findMany();
      const existingRequests = await tx.requests.findMany();

      // 2. Drop all the tables in the order of foreign key dependencies
      await tx.edges.deleteMany();
      await tx.requests.deleteMany();
      await tx.employeeJobs.deleteMany();
      await tx.employees.deleteMany();
      await tx.nodes.deleteMany();

      // 3. Re-seed the database
      await tx.nodes.createMany({
        data: existingNodes,
      });

      await tx.edges.createMany({
        data: newEdges as unknown as Prisma.EdgesCreateManyInput,
      });

      await tx.employees.createMany({
        data: existingEmployees,
      });

      await tx.employeeJobs.createMany({
        data: existingEmployeeJobs,
      });

      await tx.requests.createMany({
        data: existingRequests,
      });
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(400).send("Bad request");
  }

  res.status(200).send("File uploaded successfully");
});

function determineFileType(file: Express.Multer.File, callback: (type: string) => void) {
  const fileName = file.originalname.toLowerCase();

  if (fileName.includes('node')) {
    callback('node');
  } else if (fileName.includes('edge')) {
    callback('edge');
  } else if (fileName.includes('employee')) {
    callback('employee');
  } else {
    callback('unknown');
  }
}

interface FileType {
  name: string;
  type: string;
}

router.post("/upload/all", upload.any(), async (req, res) => {

  if (!req.files) {
    res.status(400).send('No files uploaded');
    return;
  }

  // Ensure that req.files exists and is an array
  if (!Array.isArray(req.files)) {
    res.status(400).send('Invalid request: No files uploaded');
    return;
  }

  // Access uploaded files via req.files
  const uploadedFiles = req.files as Express.Multer.File[];

  // Process each uploaded file to determine its type
  const fileTypes: FileType[] = [];
  const fileTypePromises = uploadedFiles.map(file => {
    return new Promise<void>((resolve
      ) => {
      determineFileType(file, (type) => {
        fileTypes.push({ name: file.originalname, type: type });
        resolve();
      });
    });
  });

  // Wait for all file type determinations to complete
  Promise.all(fileTypePromises)
    .then(() => {
      // Iterate over each file type
      fileTypes.forEach(fileType => {
        const { name, type } = fileType;
        // Process the file based on its type
        switch (type) {
          case 'node':
            // Process node file
            console.log(`Processing node file: ${name}`);
            break;
          case 'edge':
            // Process edge file
            console.log(`Processing edge file: ${name}`);
            break;
          case 'employee':
            // Process employee file
            console.log(`Processing employee file: ${name}`);
            break;
          default:
            // Handle unknown file type
            console.log(`Unknown file type: ${name}`);
        }
      });

      res.send('Files uploaded and processed successfully');
    })
    .catch((error) => {
      console.error('Error determining file types:', error);
      res.status(500).send('Internal Server Error');
    });
});

router.get("/download/nodes", async function (req: Request, res: Response) {
  try {
    const nodes = await PrismaClient.nodes.findMany();
    const csvData = objectsToCSV(nodes);
    res.header("Content-Type", "text/csv");
    res.attachment("nodes.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/download/edges", async function (req: Request, res: Response) {
  try {
    const edges = await PrismaClient.edges.findMany();
    const csvData = objectsToCSV(edges);
    res.header("Content-Type", "text/csv");
    res.attachment("edges.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/download/all", async function (req: Request, res: Response) {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const zip = new JSZip();
    const appendFilesPromises = [];

    const appendFileToZip = async (filename: string, data: string) => {
      zip.file(filename, data);
    };

    const nodesPromise = PrismaClient.nodes
      .findMany()
      .then((nodes) => appendFileToZip(`${timestamp}_nodes.csv`, objectsToCSV(nodes)));
    appendFilesPromises.push(nodesPromise);

    const edgesPromise = PrismaClient.edges
      .findMany()
      .then((edges) => appendFileToZip(`${timestamp}_edges.csv`, objectsToCSV(edges)));
    appendFilesPromises.push(edgesPromise);

    const servicesPromise = PrismaClient.requests
      .findMany()
      .then((requests) =>
        appendFileToZip(`${timestamp}_services.csv`, objectsToCSV(requests))
      );
    appendFilesPromises.push(servicesPromise);

    const employeesPromise = PrismaClient.employees
      .findMany()
      .then((employees) =>
        appendFileToZip(`${timestamp}_employees.csv`, objectsToCSV(employees))
      );
    appendFilesPromises.push(employeesPromise);

    const employeeJobsPromise = PrismaClient.employeeJobs
      .findMany()
      .then((jobs) => appendFileToZip(`${timestamp}_employeeJobs.csv`, objectsToCSV(jobs)));
    appendFilesPromises.push(employeeJobsPromise);

    await Promise.all(appendFilesPromises);

    zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
      fs.writeFileSync("data.zip", content);
      res.download("data.zip", "data.zip", () => {
        fs.unlinkSync("data.zip");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/pathfinding", async function (req: Request, res: Response) {
  const { startNodeId, endNodeId, algorithm } = req.body;

  if (!startNodeId || !endNodeId) {
    return res.status(400).send("Both startNodeId and endNodeId are required");
  }

  if (!["AStar", "BFS", "DFS"].includes(algorithm)) {
    return res
      .status(400)
      .send(
        "Invalid or missing algorithm type. Valid options are: 'AStar', 'BFS', 'DFS'."
      );
  }

  try {
    const nodes = await PrismaClient.nodes.findMany({
      where: { nodeID: { in: [startNodeId, endNodeId] } },
    });

    if (nodes.length < 2) {
      return res.status(404).send("One or both node IDs not found");
    }

    const graph = await GraphSingleton.getInstance();
    const context = new PathfindingContext(new BFSPathfindingStrategy());

    switch (algorithm) {
      case "DFS":
        context.setStrategy(new DFSPathfindingStrategy());
        break;
      case "AStar":
        context.setStrategy(new AStarPathfindingStrategy());
        break;
      case "BFS":
        break;
      default:
        return res.status(400).send("Unsupported algorithm");
    }

    const pathNodeIds = await context.findPath(startNodeId, endNodeId, graph);
    res.json({ path: pathNodeIds });
  } catch (error) {
    console.error("Error processing pathfinding request:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
