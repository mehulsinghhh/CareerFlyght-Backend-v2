import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getProfile } from "../controllers/user.controller";
import { createProfile } from "../controllers/user.controller";
import { getStudentProfile } from "../controllers/user.controller";
import { updateStudentProfile } from "../controllers/user.controller";
const router = Router();

router.get(
  "/me",
  authenticate,
  getProfile
);


router.get(
  "/profile",
  authenticate,
  getStudentProfile
);


router.post(
  "/profile",
  authenticate,
  createProfile
);


router.put(
  "/profile",
  authenticate,
  updateStudentProfile
);

export default router;