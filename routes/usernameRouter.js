import { Router } from "express";
import { getUsername } from "../controllers/usernameController.js";

const usernameRouter = Router();
usernameRouter.get("/:username", getUsername);

export { usernameRouter };
