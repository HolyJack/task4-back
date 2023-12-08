import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "@prisma/client";
import cors from "cors";
import prisma from "./utils/db";
import router from "./routes";

const app: Express = express();
const port = 3000;

app.use(passport.initialize());
app.use(
  session({
    secret: "123123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
    },
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: { username, password },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      if (!user.active) {
        return done(null, false, {
          message: "Your account is inactive. Contact support.",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// @ts-ignore
// no overload mathes this call
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: id as string },
    });
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err);
  }
});

app.use(router);

app.listen(port, () => console.log(`This app is listening on port ${port}`));
