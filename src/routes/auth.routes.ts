import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  register,
  login,
  me,
} from "../controllers/auth.controller";

const router = Router();

router.get(
  "/me",
  authenticate,
  me
);

router.post("/register", register);
router.post("/login", login);

export default router;