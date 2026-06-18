# CareerFlyht Backend API Contract

**Base URL:** `https://careerflyght-backend-v2-production.up.railway.app/api`

This document serves as the primary integration guide for the CareerFlyht frontend. It outlines all available routes, request/response structures, and business flows.

---

## Implementation Notes

### BigInt Serialization
The backend uses `BigInt` for database IDs. To ensure JSON compatibility, all IDs are converted to **Strings** in API responses. The frontend should handle these as strings or convert them to numbers/BigInts as needed.

### JWT Structure
Authentication is handled via JWT tokens passed in the `Authorization` header as a Bearer token.
- **Header:** `Authorization: Bearer <token>`
- **Payload Example:**
  ```json
  {
    "userId": "1",
    "role": "student",
    "iat": 1717578465,
    "exp": 1718183265
  }
  ```

### Role Values
Role values returned by the API and used in payloads:
- `student`
- `mentor`
- `admin`

---

## Role Matrix

| Action | Public | Student | Mentor | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Register / Login | ✅ | ✅ | ✅ | ✅ |
| View Mentor List | ✅ | ✅ | ✅ | ✅ |
| View Mentor Profile | ✅ | ✅ | ✅ | ✅ |
| Create/Update Student Profile | ❌ | ✅ | ❌ | ✅ |
| Create/Update Mentor Profile | ❌ | ❌ | ✅ | ✅ |
| Book a Session | ❌ | ✅ | ❌ | ❌ |
| Manage Own Bookings | ❌ | ✅ | ✅ | ✅ |
| Update Booking Status | ❌ | ❌ | ✅ | ✅ |

---

## Business Flows

### Authentication Flow
1. **Registration:** User calls `POST /auth/register` with name, email, password, and desired initial role (`student` or `mentor`).
2. **Login:** User calls `POST /auth/login` to receive a JWT token and basic user info.
3. **Persistance:** Frontend stores the JWT and includes it in the `Authorization` header for all subsequent protected requests.
4. **Session Recovery:** On app reload, the frontend calls `GET /auth/me` to verify the token and retrieve the user's current session state.

### Student Journey
1. **Onboarding:** After registration, the student must create their profile using `POST /users/profile`.
2. **Discovery:** Student browses mentors via `GET /mentors`.
3. **Booking:** Student selects a mentor and calls `POST /bookings` to request a session.
4. **Tracking:** Student views their scheduled sessions via `GET /bookings/my-bookings`.

### Mentor Journey
1. **Profile Setup:** A user registered as a mentor must complete their professional profile via `POST /mentors/profile`. (Note: Creating a mentor profile automatically upgrades/confirms the user's role as `mentor`).
2. **Management:** Mentor views incoming session requests via `GET /bookings/mentor-bookings`.
3. **Action:** Mentor confirms or cancels bookings via `PUT /bookings/:bookingId/status`.

### Booking Flow
1. **Request:** Student sends a booking request with date, time, and session type. Status defaults to `pending`.
2. **Notification:** (Backend internal) The booking becomes visible to the mentor.
3. **Confirmation:** Mentor updates the status to `confirmed` or `cancelled`.
4. **Completion:** After the session date, the status can be updated to `completed`.

---

## API Endpoints

### Authentication

#### Register User
- **Method:** `POST`
- **Route:** `/auth/register`
- **Auth Required:** No
- **Role:** Public
- **Request Payload:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "student"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "status": "pending",
      "createdAt": "2024-06-05T08:00:00.000Z"
    }
  }
  ```
- **Description:** Creates a new user account.

#### Login User
- **Method:** `POST`
- **Route:** `/auth/login`
- **Auth Required:** No
- **Role:** Public
- **Request Payload:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbG...",
      "user": {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "status": "pending"
      }
    }
  }
  ```
- **Description:** Authenticates user and returns JWT token.

#### Get Current Session
- **Method:** `GET`
- **Route:** `/auth/me`
- **Auth Required:** Yes
- **Role:** Any Authenticated User
- **Request Payload:** None
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "1",
      "role": "student",
      "iat": 1717578465,
      "exp": 1718183265
    }
  }
  ```
- **Description:** Returns the decoded JWT payload of the current user.

---

### Users

#### Get User Profile
- **Method:** `GET`
- **Route:** `/users/me`
- **Auth Required:** Yes
- **Role:** Any Authenticated User
- **Request Payload:** None
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "status": "pending",
      "profilePhoto": null,
      "createdAt": "2024-06-05T08:00:00.000Z"
    }
  }
  ```
- **Description:** Retrieves the base user account information.

---

### Student Profiles

#### Create Student Profile
- **Method:** `POST`
- **Route:** `/users/profile`
- **Auth Required:** Yes
- **Role:** Student
- **Request Payload:**
  ```json
  {
    "educationLevel": "Undergraduate",
    "preferredCountry": "USA",
    "careerInterest": "Software Engineering",
    "bio": "Aspiring developer looking for guidance.",
    "resumeUrl": "https://storage.com/resume.pdf"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "userId": "1",
      "educationLevel": "Undergraduate",
      "preferredCountry": "USA",
      "careerInterest": "Software Engineering",
      "resumeUrl": "https://storage.com/resume.pdf",
      "bio": "Aspiring developer looking for guidance."
    }
  }
  ```
- **Description:** Initializes a student-specific profile.

#### Get My Student Profile
- **Method:** `GET`
- **Route:** `/users/profile`
- **Auth Required:** Yes
- **Role:** Student
- **Request Payload:** None
- **Success Response:** Same as Create Student Profile.
- **Description:** Retrieves the logged-in student's profile details.

#### Update Student Profile
- **Method:** `PUT`
- **Route:** `/users/profile`
- **Auth Required:** Yes
- **Role:** Student
- **Request Payload:** Partial fields from Create Student Profile.
- **Success Response:** Same as Create Student Profile.
- **Description:** Updates specific fields of the student profile.

---

### Mentor Profiles

#### Create Mentor Profile
- **Method:** `POST`
- **Route:** `/mentors/profile`
- **Auth Required:** Yes
- **Role:** Any (User role is updated to `mentor` upon creation)
- **Request Payload:**
  ```json
  {
    "company": "Google",
    "designation": "Senior Engineer",
    "experienceYears": 8,
    "bio": "Experienced in cloud architecture.",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "hourlyRate": 150.00
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "userId": "1",
      "company": "Google",
      "designation": "Senior Engineer",
      "experienceYears": 8,
      "bio": "Experienced in cloud architecture.",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "hourlyRate": "150.00"
    }
  }
  ```
- **Description:** Initializes a mentor-specific profile.

#### Get My Mentor Profile
- **Method:** `GET`
- **Route:** `/mentors/profile`
- **Auth Required:** Yes
- **Role:** Mentor
- **Request Payload:** None
- **Success Response:** Same as Create Mentor Profile.
- **Description:** Retrieves the logged-in mentor's profile details.

#### Update Mentor Profile
- **Method:** `PUT`
- **Route:** `/mentors/profile`
- **Auth Required:** Yes
- **Role:** Mentor
- **Request Payload:** Partial fields from Create Mentor Profile.
- **Success Response:** Same as Create Mentor Profile.
- **Description:** Updates specific fields of the mentor profile.

---

### Mentor Discovery

#### Search/List Mentors
- **Method:** `GET`
- **Route:** `/mentors`
- **Auth Required:** No
- **Role:** Public
- **Query Parameters:**
  - `company`: Filter by company name.
  - `minExperience`: Filter by minimum years of experience.
  - `maxRate`: Filter by maximum hourly rate.
- **Success Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "1",
        "userId": "2",
        "company": "Google",
        "designation": "Senior Engineer",
        "experienceYears": 8,
        "hourlyRate": "150.00",
        "user": {
          "id": "2",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "profilePhoto": "https://cdn.com/photo.jpg"
        }
      }
    ]
  }
  ```
- **Description:** Retrieves a list of mentors with optional filtering.

#### Get Mentor Details
- **Method:** `GET`
- **Route:** `/mentors/:id`
- **Auth Required:** No
- **Role:** Public
- **Success Response:** Single mentor object with nested user details (same format as list item).
- **Description:** Retrieves full profile details for a specific mentor.

---

### Bookings

#### Create Booking
- **Method:** `POST`
- **Route:** `/bookings`
- **Auth Required:** Yes
- **Role:** Student
- **Request Payload:**
  ```json
  {
    "mentorId": "1",
    "bookingDate": "2024-07-10T10:00:00.000Z",
    "bookingTime": "10:00 AM",
    "sessionType": "online",
    "notes": "I want to discuss my career path."
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "5",
      "studentId": "1",
      "mentorId": "1",
      "bookingDate": "2024-07-10T10:00:00.000Z",
      "bookingTime": "10:00 AM",
      "sessionType": "online",
      "status": "pending",
      "notes": "I want to discuss my career path."
    }
  }
  ```
- **Description:** Creates a new session request for a mentor.

#### Get My Bookings (Student)
- **Method:** `GET`
- **Route:** `/bookings/my-bookings`
- **Auth Required:** Yes
- **Role:** Student
- **Success Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "5",
        "mentorId": "1",
        "bookingDate": "2024-07-10T10:00:00.000Z",
        "status": "pending"
      }
    ]
  }
  ```
- **Description:** Lists all bookings made by the logged-in student.

#### Get Mentor Bookings
- **Method:** `GET`
- **Route:** `/bookings/mentor-bookings`
- **Auth Required:** Yes
- **Role:** Mentor
- **Success Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "5",
        "studentId": "1",
        "bookingDate": "2024-07-10T10:00:00.000Z",
        "status": "pending"
      }
    ]
  }
  ```
- **Description:** Lists all bookings received by the logged-in mentor.

#### Update Booking Status
- **Method:** `PUT`
- **Route:** `/bookings/:bookingId/status`
- **Auth Required:** Yes
- **Role:** Mentor (Logically)
- **Request Payload:**
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "5",
      "status": "confirmed"
    }
  }
  ```
- **Description:** Updates the status of a booking (`pending`, `confirmed`, `completed`, `cancelled`).

---

### Health

#### API Health Check
- **Method:** `GET`
- **Route:** `/health` (Note: This route is outside the `/api` prefix)
- **Auth Required:** No
- **Role:** Public
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "CareerFlyht API running"
  }
  ```

---

## Primary Error Responses

| Status Code | Message | Description |
| :--- | :--- | :--- |
| `400` | Validation Error / Specific Message | Bad request, missing fields, or domain logic error (e.g., "Email already exists"). |
| `401` | Unauthorized | Token missing, invalid, or expired. |
| `403` | Forbidden | User does not have the required role to access the resource. |
| `404` | Not Found | The requested resource (User, Profile, Mentor, Booking) does not exist. |

---

## Dashboard & Booking Capability Analysis

### 1. Student Dashboard
Endpoints required to build the Student Dashboard page:
- **GET /api/users/me**: To display the student's name, role, and profile photo.
- **GET /api/users/profile**: To display education level and career interests.
- **GET /api/bookings/my-bookings**: To list upcoming and past sessions.

### 2. Mentor Dashboard
Endpoints required to build the Mentor Dashboard page:
- **GET /api/users/me**: To display the mentor's name, role, and profile photo.
- **GET /api/mentors/profile**: To display professional details like company, designation, and hourly rate.
- **GET /api/bookings/mentor-bookings**: To list all session requests received.

### 3. Student Bookings
- **Route:** `POST /api/bookings`
- **Auth Required:** Yes
- **Required Role:** `student`
- **Request Payload:**
  ```json
  {
    "mentorId": "string (BigInt ID)",
    "bookingDate": "string (ISO Date)",
    "bookingTime": "string",
    "sessionType": "online | offline",
    "notes": "string (optional)"
  }
  ```
- **Response Structure:** Object containing booking details including `id`, `status` (defaults to `pending`), and `mentorId`.
- **Purpose:** Allows a student to request a mentorship session.

### 4. Mentor Bookings
- **Route:** `PUT /api/bookings/:bookingId/status`
- **Auth Required:** Yes
- **Required Role:** `mentor`
- **Request Payload:**
  ```json
  {
    "status": "confirmed | completed | cancelled"
  }
  ```
- **Response Structure:** Object containing the updated booking with the new `status`.
- **Purpose:** Allows a mentor to manage their session requests.
