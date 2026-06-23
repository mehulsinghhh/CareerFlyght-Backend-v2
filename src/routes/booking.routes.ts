import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { createBookingController, getMyBookingsController, getMentorBookingsController, updateBookingStatusController } from "../controllers/booking.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.student),
  createBookingController
);


router.get(
  "/my-bookings",
  authenticate,
  authorize(UserRole.student),
  getMyBookingsController
);


router.get(
  "/mentor-bookings",
  authenticate,
  authorize(UserRole.mentor),
  getMentorBookingsController
);


router.put(
  "/:bookingId/status",
  authenticate,
  authorize(UserRole.mentor),
  updateBookingStatusController
);

export default router;
