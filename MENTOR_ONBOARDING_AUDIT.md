# Mentor Onboarding Audit Report

## 1. Root Cause Analysis
The previous mentor onboarding flow was broken because:
* **Missing Profiles**: Newly registered mentors were created in the `users` table with `role='mentor'`, but no corresponding record was created in the `mentor_profiles` table.
* **Lack of Onboarding Path**: The `GET /api/mentors/profile` endpoint returned "Mentor profile not found" for new mentors, and there was no idempotent way for them to complete their profile without potentially hitting "Profile already exists" errors if they tried to submit twice.
* **Rigid Profile Creation**: The `createMentorProfile` service used `prisma.create`, which throws an error if a record with the same `userId` already exists, making the onboarding flow non-resilient to retries or updates during the initial setup.

## 2. Implementation Changes
* **Service Layer (`src/services/mentor.service.ts`)**:
    * Replaced `prisma.mentorProfile.create` with `prisma.mentorProfile.upsert` in `createMentorProfile`.
    * This ensures that the onboarding process is idempotent: it creates the profile if it doesn't exist and updates it if it does.
    * Removed redundant user role update (the user is already a mentor at registration).
* **Controller Layer (`src/controllers/mentor.controller.ts`)**:
    * Updated `createProfile` to return HTTP 200 OK instead of 201 Created to accurately reflect the upsert (create or update) nature of the operation.
    * Maintained existing error handling to provide clear feedback if onboarding fails.

## 3. Updated Onboarding Flow
1. **Registration**: User registers with `role='mentor'`. User record created, no profile record yet.
2. **Login**: Mentor logs in and receives a JWT.
3. **Dashboard Redirection**: Frontend attempts to fetch `GET /api/mentors/profile`.
4. **Onboarding Trigger**: If the API returns 404 "Mentor profile not found", the frontend redirects the user to the Onboarding Form.
5. **Onboarding Submission**: Mentor submits the form to `POST /api/mentors/profile`.
6. **Profile Creation**: Backend uses `upsert` to safely create the `mentor_profiles` record.
7. **Success**: Backend returns 200 OK with the profile data. Frontend redirects to the mentor dashboard.
8. **Subsequent Access**: Future calls to `GET /api/mentors/profile` return the existing profile, and the dashboard loads successfully.

## 4. Verification Results
* **Registration**: Verified (via code audit) that mentors are created with `role='mentor'`.
* **Onboarding**: Verified that `POST /api/mentors/profile` now handles both first-time creation and subsequent updates gracefully.
* **Idempotency**: Verified that multiple calls to the onboarding endpoint do not create duplicate records.
* **Compatibility**: Verified that existing mentors (who already have profiles) are unaffected as the `GET` endpoint remains unchanged.
* **Build**: `npm run build` passed successfully with no TypeScript errors.
* **Student Flow**: Verified (via code audit) that student-specific services (`student.service.ts`) and controllers remain untouched, ensuring no regressions in student registration or dashboard flows.
