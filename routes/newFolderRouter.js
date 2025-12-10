import { Router } from "express";
import { createFolder } from "../controllers/newFolderController.js";

const newFolderRouter = Router();
newFolderRouter.post("/", createFolder);

export { newFolderRouter };
