import { Router } from "express";
import { getFilesPage } from "../controllers/filesController.js";

const filesRouter = Router();
filesRouter.get("/{*splat}", getFilesPage);

export { filesRouter };
