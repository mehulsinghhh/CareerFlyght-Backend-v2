# Admin Backend Phase 1 Smoke Test Checklist

## 1. Authentication & Authorization
- [ ] Attempt to access `GET /api/admin/dashboard` without a token (Expected: 401 Unauthorized)
- [ ] Attempt to access `GET /api/admin/dashboard` with a student role token (Expected: 403 Forbidden)
- [ ] Attempt to access `GET /api/admin/dashboard` with an admin role token (Expected: 200 OK)

## 2. Dashboard API
- [ ] `GET /api/admin/dashboard`: Verify response contains `totalStudents`, `totalMentors`, `pendingMentors`, `approvedMentors`, `rejectedMentors`, and `totalBookings`.

## 3. Mentor Management
- [ ] `GET /api/admin/mentors`: Verify response returns paginated list of all mentors.
- [ ] `GET /api/admin/mentors?status=PENDING`: Verify response only contains pending mentors.
- [ ] `GET /api/admin/mentors/pending`: Verify convenience endpoint returns same as above.
- [ ] `PATCH /api/admin/mentors/:mentorId/approve`: Verify mentor status changes to `APPROVED`.
- [ ] `PATCH /api/admin/mentors/:mentorId/reject`: Verify mentor status changes to `REJECTED` and `reviewNotes` is updated.

## 4. Student Management
- [ ] `GET /api/admin/students`: Verify response returns paginated list of all students.

## 5. Pagination
- [ ] Verify `pagination` object in list responses contains `page`, `limit`, `totalItems`, and `totalPages`.
- [ ] Verify `?page=2&limit=5` correctly applies pagination.
