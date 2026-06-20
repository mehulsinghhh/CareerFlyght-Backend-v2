# Booking Fee Flow Audit Report

## 1. MentorProfile.hourlyRate (Mentor ID 12)
- **Source:** `MentorProfile` model in `prisma/schema.prisma` (Line 72)
- **Status:** The field `hourlyRate` is defined as `Decimal?`.
- **Note:** Actual value in database for ID 12 cannot be verified without a live connection, but the system flow is traced below.

## 2. Frontend to POST /bookings
- **File:** `src/types/booking.types.ts` (Line 3)
- **Observation:** The `CreateBookingDto` interface **DOES NOT** include an `amount` or `fee` field.
- **Trace:** When the frontend calls `POST /bookings`, it only sends `mentorId`, `bookingDate`, `bookingTime`, `sessionType`, and optionally `notes`.

## 3. Booking Table Save Logic
- **File:** `src/services/booking.service.ts` (Lines 34-45)
- **Observation:** In the `createBooking` function, the `prisma.booking.create` call **OMITS** the `amount` field.
- **Code Reference:**

- **Conclusion:** Even though the `Booking` model has an `amount` field (schema.prisma Line 112), it is currently being saved as `NULL` because it is not passed during creation.

## 4. API Response (GET /bookings/my-bookings & GET /bookings/mentor-bookings)
- **File:** `src/services/booking.service.ts` (Lines 53-85)
- **Observation:** The `findMany` queries for both student and mentor bookings do not include any logic to populate or calculate the `amount` if it is missing in the record.
- **Result:** The API returns `amount: null` (or omitted) for these bookings.

## 5. Value Discrepancy (999 to 100)
- **Finding:** The backend **completely ignores** the `amount` field during booking creation.
- **Inferred Cause:** If the UI shows 100 while the mentor's hourly rate is 999, it is likely because:
  1. The frontend is hardcoding a default value of 100 when the API returns null.
  2. Or, there is a mismatch in how the mentor's `hourlyRate` is being fetched/passed in the frontend before the booking is made.
  3. The backend `createBooking` service (src/services/booking.service.ts) **fails to copy** the `mentorProfile.hourlyRate` to the `booking.amount` field.

## Summary of Findings
| Step | File | Status | Value |
| :--- | :--- | :--- | :--- |
| Mentor Profile | `src/services/mentor.service.ts` | Defined | 999 (Assumed) |
| Booking Creation | `src/services/booking.service.ts` | Omitted | NULL |
| Database | `prisma/schema.prisma` | Optional | NULL |
| API Response | `src/controllers/booking.controller.ts` | Serialized | NULL |
| UI Rendering | Frontend | Likely Hardcoded | 100 |

**Exact Location of Failure:** `src/services/booking.service.ts` at Line 43 (Missing `amount: mentorProfile.hourlyRate`).
