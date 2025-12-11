import express from "express";
import path from "node:path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import flash from "connect-flash";
import passport from "passport";
import { initPassport } from "./controllers/authenticateController.js";
import { homeRouter } from "./routes/homeRouter.js";
import { signupRouter } from "./routes/signupRouter.js";
import { loginRouter } from "./routes/loginRouter.js";
import { logoutRouter } from "./routes/logoutRouter.js";
import { usernameRouter } from "./routes/usernameRouter.js";
import { uploadRouter } from "./routes/uploadRouter.js";
import { filesRouter } from "./routes/filesRouter.js";
import { newFolderRouter } from "./routes/newFolderRouter.js";

const currentDirectory = process.cwd();
const app = express();

app.set("views", path.join(currentDirectory, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);
app.use(flash());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

initPassport();

const assetsPath = path.join(currentDirectory, "public");
app.use(express.static(assetsPath));

app.use("/", homeRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/username", usernameRouter);
app.use("/files", filesRouter);
app.use("/new-folder", newFolderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Last updated ${new Date().toISOString()}`);
});
