import express from "express";
import passport from "passport";
import prisma from "../utils/db";
import { User } from "@prisma/client";

const auth = express.Router();

auth.post("/signin", (req, res, next) =>
  passport.authenticate("local", (err: Error, user: User, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message });
    req.login(user, async (err) => {
      if (err) return next(err);
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { signinAt: new Date().toISOString() },
        });
      } catch (err) {
        next(err);
      }
      return res.json({ message: "Login successful!", user: user.username });
    });
  })(req, res, next),
);

auth.delete("/signout", (req, res) => {
  res.clearCookie("connect.sid");
  req.logout(function () {
    req.session.destroy(function () {
      res.send();
    });
  });
});

auth.post("/signup", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.status(422).json({
      status: "fail",
      message: "Please enter valid username, e-mail and password",
    });
    return;
  }

  if (await prisma.user.findFirst({ where: { username } })) {
    res.status(409).json({
      status: "fail",
      message: "User already exists",
    });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
      active: true,
    },
  });
  res.status(201).json({
    status: "created",
    username: user.username,
  });
});

export { auth };
