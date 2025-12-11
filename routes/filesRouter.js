import { Router } from "express";
import { getFilesPage, deleteFile } from "../controllers/filesController.js";

const filesRouter = Router();
filesRouter.get("/{:file_id}/delete", deleteFile);
filesRouter.get("/{:folder_id}", getFilesPage);

export { filesRouter };
