import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getProfile } from "../controllers/user.controller";
import { createProfile } from "../controllers/user.controller";
import { getStudentProfile } from "../controllers/user.controller";
import { updateStudentProfile } from "../controllers/user.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/me",
  authenticate,
  getProfile
);


router.get(
  "/profile",
  authenticate,
  authorize(UserRole.student),
  getStudentProfile
);


router.post(
  "/profile",
  authenticate,
  authorize(UserRole.student),
  createProfile
);


router.put(
  "/profile",
  authenticate,
  authorize(UserRole.student),
  updateStudentProfile
);

export default router;
