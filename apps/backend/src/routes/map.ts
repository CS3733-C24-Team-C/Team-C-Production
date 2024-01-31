import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import multer from "multer";
import fileUpload from "express-fileupload";

const router: Router = express.Router();
const upload = multer({ dest: "../../backend/uploaded-csvs" });

router.get("/nodes", async function (req: Request, res: Response) {
  const nodes = await PrismaClient.nodes.findMany();
  res.json(nodes);
});

router.get("/edges", async function (req: Request, res: Response) {
  const edges = await PrismaClient.edges.findMany();
  res.json(edges);
});

router.use(fileUpload());

// router.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

router.post(
  "/upload",
  upload.single("nodeData"),
  function (req: Request, res: Response) {
    if (!req.file || Object.keys(req.file).length === 0) {
      return res.status(400).send("No file was selected");
    }

    // Access the uploaded file using the 'sampleFile' field name
    // @ts-expect-error testing the file upload before dealing with bugs
    const uploadedFile = req.files.sampleFile;

    uploadedFile.mv("../../backend/uploaded-csvs");

    res.send('File uploaded and saved to: "../../backend/uploaded-csvs"');
  },
);

export default router;
