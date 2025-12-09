import { Router } from "express";
import { getSignupPage, createUser } from "../controllers/signupController.js";

const signupRouter = Router();
signupRouter.get("/", getSignupPage);
signupRouter.post("/", createUser);

export { signupRouter };
