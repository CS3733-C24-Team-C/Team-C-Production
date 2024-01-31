import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
//import multer from "multer";

const router: Router = express.Router();
//const upload = multer({ dest: "../../backend/uploaded-csvs" });

router.get("/nodes", async function (req: Request, res: Response) {
  const nodes = await PrismaClient.nodes.findMany();
  res.json(nodes);
});

router.get("/edges", async function (req: Request, res: Response) {
  const edges = await PrismaClient.edges.findMany();
  res.json(edges);
});

// router.post(
//   "/upload",
//   upload.single("nodeData"),
//   function (req: Request, res: Response) {
//     const csvNodes = req.file;
//   },
// );

export default router;
