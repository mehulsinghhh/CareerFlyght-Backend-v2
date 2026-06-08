import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProfile, updateProfile } from "../controllers/mentor.controller";
import { getMentors } from "../controllers/mentor.controller";
import { getProfile } from "../controllers/mentor.controller";
import { getMentor } from "../controllers/mentor.controller";

const router = Router();

router.get(
  "/",
  getMentors
);


router.get(
    "/:id",
    getMentor
);

router.post(
  "/profile",
  authenticate,
  createProfile
);

router.get(
  "/profile",
  authenticate,
  getProfile
);


router.put(
  "/profile",
  authenticate,
  updateProfile
);

export default router;