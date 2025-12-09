import { prisma } from "../lib/prisma.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import { compare } from "bcryptjs";

const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const errorMessage = "Incorrect username or password";
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });

        if (!user) {
          return done(null, false, { message: errorMessage });
        }
        const match = await compare(password, user.password);
        if (!match) {
          return done(null, false, { message: errorMessage });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export { initPassport };
