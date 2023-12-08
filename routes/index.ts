import { Router } from "express";
import { auth } from "./auth";
import { users } from "./users";
const router = Router();

router.use(auth);
router.use(users);

export default router;
