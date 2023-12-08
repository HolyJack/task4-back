import express from "express";
import prisma from "../utils/db";
import authenticate from "../middlewares/authenticate";

const users = express.Router();

users.get("/users", authenticate, async (_, res) => {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      createdAt: true,
      signinAt: true,
      active: true,
    },
  });
  res.send(users);
});

users.patch("/users", authenticate, async (req, res) => {
  const usernames = req.body.data.usernames;
  const active = req.body.data.active;
  await prisma.user.updateMany({
    where: { username: { in: usernames } },
    data: { active },
  });
  res.status(204).send();
});

users.delete("/users", authenticate, async (req, res) => {
  const usernames = req.body.usernames;
  await prisma.user.deleteMany({
    where: { username: { in: usernames } },
  });
  res.status(204).send();
});

export { users };
