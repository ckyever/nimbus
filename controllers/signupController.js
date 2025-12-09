import { prisma } from "../lib/prisma.js";
import { hash } from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";

const getSignupPage = (req, res) => {
  res.render("signup", { title: "Nimbus | Sign Up" });
};

const requiredFieldError = "is required";
const longFieldError = "must be 255 characters or less";
const shortFieldError = "must be 50 characters or less";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username " + requiredFieldError)
    .isLength({ max: 255 })
    .withMessage("Username " + longFieldError),
  body("firstname")
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name " + shortFieldError),
  body("lastname")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name " + shortFieldError),
  body("password")
    .notEmpty()
    .withMessage("Password " + requiredFieldError)
    .isLength({ max: 50 })
    .withMessage("Password " + longFieldError),
  body("confirm-password")
    .notEmpty()
    .withMessage("Please confirm password")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Confirmation password does not match");
      }
      return true;
    })
    .withMessage("Passwords do not match"),
];

const createUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "Nimbus | Sign Up",
        errors: errors.array(),
      });
    }

    const { username, password, firstname, lastname } = matchedData(req);
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.render("signup", {
        title: "Nimbus | Sign Up",
        errors: [
          { msg: `An account with the username "${username}" already exists` },
        ],
      });
    }

    let newUser;
    try {
      const SALT_ROUNDS = 10;
      const hashedPassword = await hash(password, SALT_ROUNDS);
      newUser = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          firstname: firstname,
          lastname: lastname,
        },
      });
    } catch (error) {
      console.error("Failed to insert user record");
      return res.render("signup", {
        title: "Nimbus | Sign Up",
        errors: [{ msg: "Unable to create an account" }],
      });
    }

    if (newUser) {
      try {
        await prisma.file.create({
          data: {
            type: "FOLDER",
            user_id: newUser.id,
          },
        });
      } catch (error) {
        console.error("Failed to create user's root directory");
        return res.status(500).send("Internal server error");
      }
    }

    req.login(newUser, (error) => {
      if (error) {
        console.error("Passport login failed after sign up", error);
        return next(error);
      }
      return res.redirect("/");
    });
  },
];

export { getSignupPage, createUser };
