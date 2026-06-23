# Security Audit: Booking Ownership and Authorization Hardening

This document outlines the security improvements implemented to enforce strict ownership and prevent Insecure Direct Object Reference (IDOR) vulnerabilities in the CareerFlyht API.

## 1. Ownership Rules Enforced

### Student Ownership
- **Booking Creation**: `POST /api/bookings` automatically associates the new booking with the authenticated user's `StudentProfile` based on their `userId` in the JWT. Students cannot specify a different `studentId`.
- **My Bookings View**: `GET /api/bookings/my-bookings` only returns bookings where the `studentId` belongs to the authenticated user.

### Mentor Ownership
- **Mentor Bookings View**: `GET /api/bookings/mentor-bookings` only returns bookings where the `mentorId` belongs to the authenticated user's `MentorProfile`.
- **Booking Status Update**: `PUT /api/bookings/:bookingId/status` now strictly verifies that the `bookingId` provided in the URL is assigned to the authenticated mentor.

## 2. Reviewed Endpoints

| Endpoint | Method | Role Required | Ownership Logic | Attacks Prevented |
| :--- | :--- | :--- | :--- | :--- |
| `/api/bookings` | POST | Student | Derived from `req.user.userId` | Booking creation on behalf of others |
| `/api/bookings/my-bookings` | GET | Student | Derived from `req.user.userId` | Viewing other students' bookings |
| `/api/bookings/mentor-bookings` | GET | Mentor | Derived from `req.user.userId` | Viewing other mentors' bookings |
| `/api/bookings/:bookingId/status` | PUT | Mentor | Cross-check `booking.mentorId` with `mentor.id` | Updating other mentors' bookings |
| `/api/users/profile` | GET/POST/PUT | Student | Derived from `req.user.userId` | Accessing/Modifying other students' profiles |
| `/api/mentors/profile` | GET/POST/PUT | Mentor | Derived from `req.user.userId` | Accessing/Modifying other mentors' profiles |

## 3. Attacks Prevented

### Insecure Direct Object Reference (IDOR)
By strictly deriving profile identities (Student and Mentor) from the authenticated `userId` (JWT), we have eliminated the possibility of an attacker manipulating IDs in the request body or URL to access or modify data belonging to other users.

### Unauthorized Status Manipulation
The hardening of the `updateBookingStatus` service ensures that even if a mentor knows a `bookingId` belonging to another mentor, they cannot change its status. Any attempt to do so will result in a `403 Forbidden` response.

### Identity Spoofing
The removal of optional chaining and the enforcement of non-nullable `req.user` (guaranteed by middleware) ensures that the application logic always operates on a verified identity.
