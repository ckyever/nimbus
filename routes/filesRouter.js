import { Router } from "express";
import { getFilesPage } from "../controllers/filesController.js";

const filesRouter = Router();
filesRouter.get("/{:folder_id}", getFilesPage);

export { filesRouter };
