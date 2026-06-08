import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createBookingController, getMyBookingsController, getMentorBookingsController, updateBookingStatusController } from "../controllers/booking.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createBookingController
);


router.get(
  "/my-bookings",
  authenticate,
  getMyBookingsController
);


router.get(
  "/mentor-bookings",
  authenticate,
  getMentorBookingsController
);


router.put(
  "/:bookingId/status",
  authenticate,
  updateBookingStatusController
);

export default router;