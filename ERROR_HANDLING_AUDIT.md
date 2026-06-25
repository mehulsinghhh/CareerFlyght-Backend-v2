# Backend Hardening: Error Handling Standardization Audit Report

## Root Cause Summary
Prior to this pass, the backend had inconsistent error handling patterns. Errors were sometimes caught and returned with hardcoded status codes (often 400 or 500) in controllers, while other times they were thrown as generic `Error` objects in services, leading to 500 responses even for operational errors (like "Not Found" or "Unauthorized"). There was also significant duplication of try/catch blocks that manually shaped error responses.

## Files Changed
- `src/utils/app-error.ts` (New): Introduced lightweight `AppError` class.
- `src/middleware/error.middleware.ts`: Updated to handle `AppError` and standardize response format.
- `src/middleware/auth.middleware.ts`: Standardized 401/403 responses using `AppError`.
- `src/services/auth.service.ts`: Standardized registration (409) and login (401) errors.
- `src/services/booking.service.ts`: Standardized not found (404) and forbidden (403) errors.
- `src/services/mentor.service.ts`: Standardized mentor not found (404) errors.
- `src/services/student.service.ts`: Standardized profile conflict (409) errors.
- `src/controllers/auth.controller.ts`: Refactored to delegate error handling to global middleware.
- `src/controllers/booking.controller.ts`: Refactored to delegate error handling to global middleware.
- `src/controllers/mentor.controller.ts`: Refactored to delegate error handling to global middleware.
- `src/controllers/user.controller.ts`: Refactored to delegate error handling to global middleware.

## Standardizations Made
- **Centralized Error Handling:** All controllers now catch errors and pass them to `next(error)`, allowing the global error handler to manage responses.
- **Specific HTTP Status Codes:**
    - `401 Unauthorized` for authentication failures.
    - `403 Forbidden` for authorization failures.
    - `404 Not Found` for missing resources.
    - `409 Conflict` for duplicate resources (e.g., email already exists).
    - `400 Bad Request` for validation or client errors.
- **Consistent Response Shape:** All error responses follow the `{ success: false, message: string }` format, ensuring compatibility with the existing frontend.
- **Operational Error Flagging:** Using `AppError` allows the system to distinguish between expected operational errors and unexpected programmer errors (500).

## Security or Reliability Improvements
- **Reduced Info Leakage:** Stack traces are now hidden in production (non-development environments).
- **Accurate Status Codes:** Improved semantics for API consumers and better logging/monitoring potential.
- **Improved Maintainability:** Drastically reduced duplicated error handling code in controllers.

## Breaking Changes
- **None.** API contracts, endpoint URLs, and response structures remain identical. Error messages used by the frontend (e.g., "Mentor profile not found") have been strictly preserved.

## Verification Performed
- **Build Check:** Ran `npm run build` - successful with no TypeScript errors.
- **Manual Code Audit:** Verified all modified controllers correctly pass errors to `next()`.
- **Message Integrity:** Confirmed critical frontend-dependent messages are unchanged.
