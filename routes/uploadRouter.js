import { Router } from "express";
import { getUploadPage, uploadFile } from "../controllers/uploadController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const uploadRouter = Router();
uploadRouter.get("/", getUploadPage);
uploadRouter.post("/", upload.single("file"), uploadFile);

export { uploadRouter };
