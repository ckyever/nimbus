import { Router } from "express";
import { getLoginPage } from "../controllers/loginController.js";
import passport from "passport";

const loginRouter = Router();
loginRouter.get("/", getLoginPage);
loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

export { loginRouter };
