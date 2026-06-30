# CareerFlyght API Contract - Admin Module

This document outlines the Admin API endpoints for CareerFlyght Phase 1.

## Base URL
`/api/admin`

## Authentication
All endpoints require a valid JWT token in the `Authorization` header and the user must have the `admin` role.
`Authorization: Bearer <token>`

---

## 1. Dashboard

### GET /dashboard
Returns aggregated platform statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalMentors": 45,
    "pendingMentors": 12,
    "approvedMentors": 30,
    "rejectedMentors": 3,
    "totalBookings": 280
  }
}
```

---

## 2. Mentors

### GET /mentors
Returns a paginated list of all mentors. Supports optional filtering by status.

**Query Parameters:**
- `status`: (Optional) `PENDING`, `APPROVED`, `REJECTED`
- `page`: (Optional) Default: `1`
- `limit`: (Optional) Default: `20`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "10",
      "company": "Google",
      "designation": "Software Engineer",
      "experienceYears": 5,
      "hourlyRate": "50.00",
      "approvalStatus": "PENDING",
      "user": {
        "id": "10",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePhoto": "https://example.com/photo.jpg",
        "createdAt": "2023-10-01T12:00:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
```

### GET /mentors/pending
Convenience endpoint to get all pending mentors. Same response structure as `GET /mentors`.

**Query Parameters:**
- `page`: (Optional) Default: `1`
- `limit`: (Optional) Default: `20`

---

### PATCH /mentors/:mentorId/approve
Approves a mentor profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Mentor approved successfully",
  "data": {
    "id": "1",
    "approvalStatus": "APPROVED",
    "reviewedBy": "5",
    "reviewedAt": "2023-10-05T14:30:00Z"
  }
}
```

---

### PATCH /mentors/:mentorId/reject
Rejects a mentor profile with an optional reason.

**Request Body:**
```json
{
  "reason": "Missing profile information"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Mentor rejected successfully",
  "data": {
    "id": "1",
    "approvalStatus": "REJECTED",
    "reviewNotes": "Missing profile information",
    "reviewedBy": "5",
    "reviewedAt": "2023-10-05T14:30:00Z"
  }
}
```

---

### PATCH /mentors/:mentorId/status
Generic endpoint to update mentor status.

**Request Body:**
```json
{
  "status": "APPROVED",
  "reviewNotes": "Profile looks great!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Mentor status updated to APPROVED",
  "data": { ... }
}
```

---

## 3. Students

### GET /students
Returns a paginated list of all students.

**Query Parameters:**
- `page`: (Optional) Default: `1`
- `limit`: (Optional) Default: `20`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "12",
      "educationLevel": "Bachelors",
      "preferredCountry": "USA",
      "user": {
        "id": "12",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profilePhoto": null,
        "createdAt": "2023-09-20T10:00:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

---

## Error Responses

### 401 Unauthorized
Returned when token is missing or invalid.
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
Returned when user is authenticated but does not have the `admin` role.
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 Not Found
Returned when the requested resource (e.g., mentorId) does not exist.
```json
{
  "success": false,
  "message": "Mentor not found"
}
```
