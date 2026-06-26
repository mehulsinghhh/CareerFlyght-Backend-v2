# CareerFlyght Admin Panel & Mentor Verification Architecture Audit

## 1. Current Architecture Summary
The backend is a Node.js/Express application using TypeScript and Prisma (MySQL).
*   **Authentication:** JWT-based with `userId` and `role` in the payload.
*   **RBAC:** Standard middleware (`authorize`) supports roles: `student`, `mentor`, `admin`.
*   **Profiles:** Strictly separated `StudentProfile` and `MentorProfile` linked to a `User` record via `userId`.
*   **Discovery:** `MentorDiscovery` currently retrieves all profiles without filtering by verification status.
*   **Bookings:** Basic flow implemented with ownership checks for status updates.

## 2. Existing Strengths
*   **Extensible RBAC:** The `authorize(...allowedRoles)` middleware is already designed to handle multiple roles and can easily accommodate `admin`.
*   **Decoupled Models:** The separation of `User`, `StudentProfile`, and `MentorProfile` allows for independent lifecycle management.
*   **Centralized Error Handling:** Standardized `AppError` and middleware simplify consistency across new Admin endpoints.
*   **Idempotent Services:** Use of `upsert` in profile services ensures robustness during onboarding and updates.

## 3. Existing Gaps
*   **Binary Verification:** `MentorProfile.isVerified` is a boolean, which cannot represent states like `REJECTED` or `PENDING` effectively.
*   **Discovery Filtering:** Mentors are visible to students immediately upon profile creation, regardless of verification status.
*   **Admin Infrastructure:** No dedicated routes or services currently exist for administrative operations.
*   **Booking Security:** Students can book unverified mentors.

## 4. Recommended Schema Changes
*   **MentorProfile Update:**
    *   Replace `isVerified` (Boolean) with `verificationStatus` (Enum: `PENDING`, `APPROVED`, `REJECTED`).
    *   Add `verifiedAt` (DateTime) and `verifiedBy` (BigInt, optional) for audit trails.
*   **User Update (Optional but Recommended):**
    *   Maintain `User.status` (ACTIVE/INACTIVE) separate from `MentorProfile.verificationStatus`.
*   **Future Proofing:**
    *   The `Document` model should remain as is, but a relation or metadata field could be added later to link specific documents to a verification "batch" or "request".

## 5. Mentor Verification Flow
1.  **Trigger:** Automatic transition to `verificationStatus: PENDING` upon successful `MentorProfile` creation/update (if not already APPROVED).
2.  **Discovery Restriction:** Update `getAllMentors` service to include `where: { verificationStatus: 'APPROVED' }`.
3.  **Booking Restriction:** Update `createBooking` service to verify the mentor's status is `APPROVED` before record creation.
4.  **Admin Action:** Admin uses `PATCH /api/admin/mentors/:id/verify` to move status to `APPROVED` or `REJECTED`.

## 6. Admin Authentication Architecture
*   **Current State:** `UserRole.admin` exists.
*   **RBAC Extension:** For future granular roles (e.g., `SUPER_ADMIN`, `VERIFIER`), we can replace the `UserRole` enum with a `Permission` based system or hierarchical roles in the `authorize` middleware. For now, the existing `authorize(UserRole.admin)` is sufficient.
*   **Namespace:** Use a dedicated `/api/admin` route prefix to isolate administrative logic.

## 7. Recommended Admin APIs
### Dashboard & Stats
*   `GET /api/admin/stats`: Aggregate counts for mentors (by status), students, and bookings (by status).
*   `GET /api/admin/dashboard`: Recent activity feed (new registrations, pending verifications).

### Mentor Management
*   `GET /api/admin/mentors`: List all mentors with filtering by `verificationStatus`.
*   `GET /api/admin/mentors/:id`: Detailed view including profile, user data, and uploaded documents.
*   `PATCH /api/admin/mentors/:id/verify`: Update `verificationStatus` and optional admin notes.

### User & Booking Oversight
*   `GET /api/admin/users`: List all users with role filtering.
*   `GET /api/admin/bookings`: Global booking list with status/date filters.

## 8. Future Scalability Recommendations
*   **Suspension/Banning:** Add a `moderationStatus` to `User` or `MentorProfile` to handle `SUSPENDED` or `BANNED` states without affecting the `verificationStatus` history.
*   **Featured Mentors:** Add an `isFeatured` (Boolean) and `sortOrder` (Int) to `MentorProfile`.
*   **Notifications:** Integrate an event-driven pattern where status changes emit events (e.g., `mentor.verified`) that listeners (EmailService, InAppNotificationService) can act upon.

## 9. Migration Risks
*   **Existing Mentors:** Existing profiles with `isVerified: false` must be migrated to `verificationStatus: PENDING`. Profiles with `isVerified: true` should be moved to `APPROVED`.
*   **Data Integrity:** Transitioning from Boolean to Enum requires a database migration.
*   **Student Experience:** Currently visible mentors might suddenly "disappear" from discovery once filtering is enforced, until they are approved.

## 10. Suggested Implementation Order
1.  **Database Migration:** Add `verificationStatus` enum and fields to `MentorProfile`.
2.  **Service Hardening:** Update `getAllMentors` and `createBooking` to filter for `APPROVED` status.
3.  **Admin API Foundation:** Implement `/api/admin` routes and `authorize(UserRole.admin)` protection.
4.  **Verification Logic:** Implement the `PATCH /api/admin/mentors/:id/verify` endpoint.
5.  **Admin UI (Frontend):** Build the verification queue and dashboard stats components.
