import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getMentors,
  updateMentorStatus,
  getDashboard,
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getStudents,
  getStudentDetail,
  getStudentBookings,
  getMentorDetail,
  getAllBookings,
  getBookingDetail
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
 * @route GET /api/admin/mentors/:mentorId
 * @desc Get complete mentor profile
 */
router.get("/mentors/:mentorId", getMentorDetail);

/**
 * @route GET /api/admin/students
 * @desc Get paginated list of students
 */
router.get("/students", getStudents);

/**
 * @route GET /api/admin/students/:studentId
 * @desc Get complete student profile
 */
router.get("/students/:studentId", getStudentDetail);

/**
 * @route GET /api/admin/students/:studentId/bookings
 * @desc Get all bookings for a student
 */
router.get("/students/:studentId/bookings", getStudentBookings);

/**
 * @route GET /api/admin/bookings
 * @desc Get paginated list of bookings
 */
router.get("/bookings", getAllBookings);

/**
 * @route GET /api/admin/bookings/:bookingId
 * @desc Get complete booking detail
 */
router.get("/bookings/:bookingId", getBookingDetail);

export default router;
