import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getMentors, updateMentorStatus } from "../controllers/admin.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize(UserRole.admin));

/**
 * @route GET /api/admin/mentors
 * @desc Get mentors with optional status filtering
 */
router.get("/mentors", getMentors);

/**
 * @route PATCH /api/admin/mentors/:mentorId/status
 * @desc Update mentor approval status and review notes
 */
router.patch("/mentors/:mentorId/status", updateMentorStatus);

export default router;
