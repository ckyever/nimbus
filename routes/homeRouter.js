import { Router } from "express";
import { getHomePage } from "../controllers/homeController.js";

const homeRouter = Router();
homeRouter.get("/", getHomePage);

export { homeRouter };
