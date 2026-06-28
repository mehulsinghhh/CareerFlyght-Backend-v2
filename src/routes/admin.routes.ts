import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getMentors,
  updateMentorStatus,
  getDashboard,
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getStudents
} from "../controllers/admin.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize(UserRole.admin));

/**
 * @route GET /api/admin/dashboard
 * @desc Get aggregated dashboard statistics
 */
router.get("/dashboard", getDashboard);

/**
 * @route GET /api/admin/mentors
 * @desc Get mentors with optional status filtering and pagination
 */
router.get("/mentors", getMentors);

/**
 * @route GET /api/admin/mentors/pending
 * @desc Get pending mentors with pagination
 */
router.get("/mentors/pending", getPendingMentors);

/**
 * @route PATCH /api/admin/mentors/:mentorId/approve
 * @desc Approve a mentor
 */
router.patch("/mentors/:mentorId/approve", approveMentor);

/**
 * @route PATCH /api/admin/mentors/:mentorId/reject
 * @desc Reject a mentor with optional reason
 */
router.patch("/mentors/:mentorId/reject", rejectMentor);

/**
 * @route PATCH /api/admin/mentors/:mentorId/status
 * @desc Generic update for mentor approval status and review notes
 */
router.patch("/mentors/:mentorId/status", updateMentorStatus);

/**
 * @route GET /api/admin/students
 * @desc Get paginated list of students
 */
router.get("/students", getStudents);

export default router;
