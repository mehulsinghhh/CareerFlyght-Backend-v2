import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { createProfile, updateProfile } from "../controllers/mentor.controller";
import { getMentors } from "../controllers/mentor.controller";
import { getProfile } from "../controllers/mentor.controller";
import { getMentor } from "../controllers/mentor.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  getMentors
);


router.post(
  "/profile",
  authenticate,
  authorize(UserRole.mentor),
  createProfile
);

router.get(
  "/profile",
  authenticate,
  authorize(UserRole.mentor),
  getProfile
);


router.put(
  "/profile",
  authenticate,
  authorize(UserRole.mentor),
  updateProfile
);

router.get(
    "/:id",
    getMentor
);

export default router;
