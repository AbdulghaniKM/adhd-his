# HisApi — Frontend Integration Guide

> **Base URL:** `https://his-api.bitxero-iq.com`  
> **API Prefix:** `/api`  
> **EEG module is excluded — it is not production-ready.**

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [Standard Response Shapes](#2-standard-response-shapes)
3. [Enums Reference](#3-enums-reference)
4. [Pagination & Filtering](#4-pagination--filtering)
5. [Soft Delete Pattern](#5-soft-delete-pattern)
6. [File Uploads](#6-file-uploads)
7. [Role-Access Matrix](#7-role-access-matrix)
8. [Endpoints](#8-endpoints)
   - [Auth](#auth)
   - [Patients](#patients)
   - [Patient Allergies](#patient-allergies)
   - [Patient Vitals](#patient-vitals)
   - [Doctors](#doctors)
   - [Doctor Education](#doctor-education)
   - [Doctor Availability](#doctor-availability)
   - [Admins](#admins)
   - [Lab Techs](#lab-techs)
   - [Departments](#departments)
   - [Labs](#labs)
   - [Enums](#enums-endpoints)

---

## 1. Authentication Flow

### How It Works

1. Call the appropriate login endpoint for the user type.
2. The API returns a **JWT Bearer token** (`AccessToken`) and its expiry.
3. Attach the token to **every subsequent request** as:
   ```
   Authorization: Bearer <AccessToken>
   ```
4. On logout, call `POST /api/auth/logout` — the token is revoked server-side and cannot be reused even if not expired.

### Roles

| Role | Integer Value | Arabic Label | Description |
|------|--------------|--------------|-------------|
| `SuperAdmin` | 1 | سوبر ادمن | Full access, bypasses all role restrictions |
| `Admin` | 2 | ادمن | Manages most resources |
| `Doctor` | 3 | طبيب | Clinical access |
| `LabTech` | 4 | تقني مختبر | Lab-scoped read/write access |

> **Tip:** Store the `Role` field from the login response to control which UI views are shown without parsing the JWT.

### Login Endpoints by Role

| Role | Endpoint |
|------|----------|
| Admin / SuperAdmin | `POST /api/auth/admin/login` |
| Doctor | `POST /api/auth/doctor/login` |
| LabTech | `POST /api/auth/lab-tech/login` |

### Login Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

### Login Success Response `200 OK`

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGci...",
    "expiresAt": "2026-04-17T10:00:00Z",
    "role": "Admin",
    "user": {
      "id": "uuid",
      "name": "John Doe"
    }
  }
}
```

### Login Failure Response `401 Unauthorized`

```json
{
  "isSuccess": false,
  "statusCode": 401,
  "errorMessage": "Unauthorized"
}
```

### Logout

```
POST /api/auth/logout
Authorization: Bearer <token>
```

Response: `200 OK` (empty success)

---

## 2. Standard Response Shapes

All endpoints return one of three response envelopes:

### Success with Data

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": { ... }
}
```

### Success without Data (delete / restore operations)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": null
}
```

### Failure

```json
{
  "isSuccess": false,
  "statusCode": 400,
  "errorMessage": "Human-readable error message"
}
```

### Paginated Response

When listing resources, `data` is a `PagedList` object:

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "data": {
    "items": [ ... ],
    "pageNumber": 1,
    "pageSize": 20,
    "totalCount": 85,
    "totalPages": 5
  }
}
```

> **Page size cap:** Maximum is **50** per page regardless of what is sent.  
> **Default page size:** 20 if not provided.

### Base Response Fields (all response objects include these)

```json
{
  "id": "uuid",
  "createdAt": "2026-04-10T08:00:00Z",
  "updatedAt": "2026-04-10T09:00:00Z"
}
```

Soft-deletable resources also include:

```json
{
  "isDeleted": false,
  "deletedAt": null
}
```

---

## 3. Enums Reference

All enums are exposed as API endpoints — no need to hardcode values. Fetch them once and cache in your app.

```
GET /api/enums/<enum-name-in-kebab-case>
```

Each item returns:

```json
{
  "id": 0,
  "name": "NotSet",
  "value": "غير محدد"
}
```

Use `id` (integer) when **sending** enum values in requests. Use `value` (Arabic display name) for **rendering** in the UI.

### Available Enum Endpoints

| Endpoint | Used In |
|----------|---------|
| `GET /api/enums/app-roles` | Auth / user management |
| `GET /api/enums/gender` | Patients, Doctors |
| `GET /api/enums/week-days` | Doctor availability |
| `GET /api/enums/blood-type` | Patients, Doctors |
| `GET /api/enums/patient-status` | Patients |
| `GET /api/enums/allergy-severity` | Patient allergies |
| `GET /api/enums/appointment-type` | Appointments |
| `GET /api/enums/appointment-status` | Appointments |

### Quick Reference (values to send in requests)

**Gender**
| id | name | Display |
|----|------|---------|
| 0 | NotSet | غير محدد |
| 1 | Male | ذكر |
| 2 | Female | انثى |

> Sending `NotSet (0)` for gender is rejected — patients and doctors must have a gender specified.

**BloodType**
| id | name | Display |
|----|------|---------|
| 0 | APositive | A+ |
| 1 | ANegative | A- |
| 2 | BPositive | B+ |
| 3 | BNegative | B- |
| 4 | ABPositive | AB+ |
| 5 | ABNegative | AB- |
| 6 | OPositive | O+ |
| 7 | ONegative | O- |

**PatientStatus**
| id | name | Display |
|----|------|---------|
| 0 | NotSet | غير محدد |
| 1 | InPatient | مريض داخلي |
| 2 | OutPatient | مريض خارجي |

**AllergySeverity**
| id | name | Display |
|----|------|---------|
| 0 | Mild | خفيف |
| 1 | Moderate | متوسط |
| 2 | Severe | شديد |

**AppointmentType**
| id | name | Display |
|----|------|---------|
| 0 | InPerson | حضوري |
| 1 | Online | عن بعد |

**AppointmentStatus**
| id | name | Display |
|----|------|---------|
| 0 | Scheduled | مجدول |
| 1 | Confirmed | مؤكد |
| 2 | CheckedIn | تم التسجيل |
| 3 | CheckedOut | تم الخروج |
| 4 | Cancelled | ملغي |

**WeekDays**
| id | name | Display |
|----|------|---------|
| 0 | Saturday | سبت |
| 1 | Sunday | احد |
| 2 | Monday | اثنين |
| 3 | Tuesday | ثلاثاء |
| 4 | Wednesday | اربعاء |
| 5 | Thursday | خميس |
| 6 | Friday | جمعة |

---

## 4. Pagination & Filtering

All list endpoints accept these query parameters:

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `pageNumber` | int | 1 | Minimum: 1 |
| `pageSize` | int | 20 | Maximum: 50 |
| `sortBy` | string | — | Field name to sort by |
| `sortDescending` | bool | false | — |
| `isDeleted` | bool? | false | SuperAdmin only; others always see `false` |

String filter fields use a **LIKE/contains** match (e.g., `firstName=ali` matches "Aliah", "ali", "Salim Ali").

---

## 5. Soft Delete Pattern

Most resources support soft delete instead of permanent removal. There are **three distinct operations**:

| Operation | HTTP Method | Route Suffix | What It Does |
|-----------|-------------|--------------|--------------|
| Soft Delete | `DELETE` | `/{id}/soft` | Marks record as deleted (`isDeleted = true`) |
| Restore | `PATCH` | `/{id}/soft` | Restores a soft-deleted record |
| Permanent Delete | `DELETE` | `/{id}` | Removes the record from the database forever |

> Non-SuperAdmin users **never see** soft-deleted records in list or get-by-id responses. Only SuperAdmin can query deleted records by sending `isDeleted=true`.

---

## 6. File Uploads

Endpoints that accept images use **`multipart/form-data`**. Send the image field as `image` (optional in all cases).

Image URLs in responses are absolute URLs:
```
https://his-api.bitxero-iq.com/uploads/patients/<fileId>.jpg
```

**Supported entity types with images:** Patients, Doctors, Admins, LabTechs.

---

## 7. Role-Access Matrix

Legend: **A** = Admin, **SA** = SuperAdmin, **D** = Doctor, **LT** = LabTech

| Resource & Action | SA | A | D | LT |
|-------------------|----|---|---|----|
| **Auth** | | | | |
| Login | ✓ | ✓ | ✓ | ✓ |
| Logout | ✓ | ✓ | ✓ | ✓ |
| **Patients** | | | | |
| Create | ✓ | ✓ | ✓ | |
| List / Get | ✓ | ✓ | ✓ | ✓ |
| Update | ✓ | ✓ | ✓ | |
| Soft Delete | ✓ | ✓ | ✓ | |
| Restore | ✓ | ✓ | | |
| Permanent Delete | ✓ | ✓ | | |
| **Patient Allergies** | | | | |
| Create / Update | ✓ | ✓ | ✓ | |
| List | ✓ | ✓ | ✓ | ✓ |
| Soft Delete / Restore | ✓ | ✓ | ✓ | |
| Permanent Delete | ✓ | ✓ | ✓ | |
| **Patient Vitals** | | | | |
| Create | ✓ | ✓ | ✓ | |
| List | ✓ | ✓ | ✓ | ✓ |
| Permanent Delete | ✓ | ✓ | ✓ | |
| **Doctors** | | | | |
| Create | ✓ | ✓ | | |
| List / Get | ✓ | ✓ | ✓ | |
| Update (admin) | ✓ | ✓ | | |
| Update own profile | ✓ | | ✓ | |
| Soft Delete / Restore / Hard Delete | ✓ | ✓ | | |
| **Doctor Education** | | | | |
| Create / Update / Delete | ✓ | ✓ | | |
| List | ✓ | ✓ | ✓ | |
| **Doctor Availability** | | | | |
| Create / Update / Delete | ✓ | ✓ | | |
| List | ✓ | ✓ | ✓ | |
| **Admins** | | | | |
| All operations | ✓ | ✓ | | |
| **Lab Techs** | | | | |
| All operations | ✓ | ✓ | | |
| **Departments** | | | | |
| Create / Update / Delete | ✓ | ✓ | | |
| List / Get | ✓ | ✓ | ✓ | ✓ |
| **Labs** | | | | |
| Create / Update / Soft Delete | ✓ | ✓ | | ✓ |
| Restore / Hard Delete | ✓ | ✓ | | |
| List / Get | ✓ | ✓ | ✓ | ✓ |
| **Appointments** | | | | |
| Create | ✓ | ✓ | ✓ | |
| Get By Id | ✓ | ✓ | ✓ | |
| List All | ✓ | ✓ | | |
| List By Patient / Doctor | ✓ | ✓ | ✓ | |
| Update Status | ✓ | ✓ | ✓ | |
| Soft Delete / Restore / Hard Delete | ✓ | ✓ | ✓ | |

---

## 8. Endpoints

---

### Auth

#### `POST /api/auth/admin/login`
#### `POST /api/auth/doctor/login`
#### `POST /api/auth/lab-tech/login`

**Auth required:** No

**Request body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "accessToken": "string",
    "expiresAt": "2026-04-17T10:00:00Z",
    "role": "Admin",
    "user": {
      "id": "uuid",
      "name": "string"
    }
  }
}
```

**Errors:** `401` Invalid credentials

---

#### `POST /api/auth/logout`

**Auth required:** Yes (any role)

**Response `200 OK`:** Empty success

---

### Patients

#### `POST /api/patients`

**Auth required:** Admin, Doctor  
**Content-Type:** `multipart/form-data`

**Request fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| firstName | string | Yes | max 100 |
| lastName | string | Yes | max 100 |
| phone | string | Yes | max 30 |
| birthDate | DateOnly `YYYY-MM-DD` | Yes | — |
| gender | int (enum) | Yes | 1 or 2 (NotSet not allowed) |
| email | string | No | valid email, max 320 |
| bloodType | int (enum) | No | 0–7 |
| address | string | No | — |
| primaryDoctorId | uuid | No | Must exist |
| image | file | No | — |

**Response `200 OK`:** `PatientResponse`

```json
{
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "birthDate": "1990-05-15",
    "gender": 1,
    "bloodType": 0,
    "address": "string",
    "status": 0,
    "primaryDoctorId": "uuid",
    "primaryDoctor": { "id": "uuid", "firstName": "string", "lastName": "string" },
    "imageUrl": "https://his-api.bitxero-iq.com/uploads/patients/xyz.jpg",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` Validation error, `404` PrimaryDoctor not found

---

#### `GET /api/patients`

**Auth required:** Admin, Doctor, LabTech

**Query parameters:**

| Parameter | Type | Filter Type |
|-----------|------|-------------|
| firstName | string | LIKE |
| lastName | string | LIKE |
| email | string | LIKE |
| phone | string | LIKE |
| status | int (enum) | Exact |
| primaryDoctorId | uuid | Exact |
| pageNumber | int | — |
| pageSize | int | — |

**Response `200 OK`:** Paged list of `PatientResponse`

---

#### `GET /api/patients/{id}`

**Auth required:** Admin, Doctor, LabTech

**Response `200 OK`:** Single `PatientResponse`  
**Errors:** `404` Not found

---

#### `GET /api/patients/{id}/profile`

**Auth required:** Admin, Doctor, LabTech

Returns the patient's full profile including:
- All base patient fields
- `latestVitals` — the most recent vitals record
- `allergies` — full allergy list
- `lastVisits` — recent appointment history

**Response `200 OK`:**
```json
{
  "data": {
    "...all PatientResponse fields...",
    "latestVitals": {
      "id": "uuid",
      "heartRate": 72,
      "bloodPressure": "120/80",
      "weight": 70.5,
      "height": 175.0,
      "recordedAt": "2026-04-09T10:00:00Z",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "allergies": [ ... ],
    "lastVisits": [ ... ]
  }
}
```

**Errors:** `404` Not found

---

#### `PUT /api/patients/{id}`

**Auth required:** Admin, Doctor  
**Content-Type:** `multipart/form-data`

All fields optional. Only send what needs to change.

| Field | Type | Validation |
|-------|------|------------|
| firstName | string | max 100 |
| lastName | string | max 100 |
| phone | string | max 30 |
| birthDate | DateOnly | — |
| gender | int | — |
| email | string | valid email |
| bloodType | int | — |
| address | string | — |
| status | int (enum) | 0–2 |
| primaryDoctorId | uuid | Must exist |
| image | file | — |

**Errors:** `400` Validation, `404` Not found

---

#### `DELETE /api/patients/{id}/soft` — Soft delete (Admin, Doctor)
#### `PATCH  /api/patients/{id}/soft` — Restore (Admin only)
#### `DELETE /api/patients/{id}` — Permanent delete (Admin only)

All return `200 OK` empty success or `404` not found.

---

### Patient Allergies

Base path: `/api/patients/{patientId}/allergies`

#### `POST /api/patients/{patientId}/allergies`

**Auth required:** Admin, Doctor

```json
{
  "allergen": "string (max 200)",
  "reaction": "string (optional)",
  "severity": 0
}
```

**Response `200 OK`:** `AllergyResponse`
```json
{
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "allergen": "string",
    "reaction": "string",
    "severity": 1,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `404` Patient not found

---

#### `GET /api/patients/{patientId}/allergies`

**Auth required:** Admin, Doctor, LabTech  
**Query:** `pageNumber`, `pageSize`

**Response:** Paged list of `AllergyResponse`

---

#### `PUT /api/patients/{patientId}/allergies/{allergyId}`

**Auth required:** Admin, Doctor

All fields optional:
```json
{
  "allergen": "string",
  "reaction": "string",
  "severity": 2
}
```

---

#### `DELETE /api/patients/{patientId}/allergies/{allergyId}/soft` — Soft delete (Admin, Doctor)
#### `PATCH  /api/patients/{patientId}/allergies/{allergyId}/soft` — Restore (Admin, Doctor)
#### `DELETE /api/patients/{patientId}/allergies/{allergyId}` — Permanent delete (Admin, Doctor)

---

### Patient Vitals

Base path: `/api/patients/{patientId}/vitals`

#### `POST /api/patients/{patientId}/vitals`

**Auth required:** Admin, Doctor

```json
{
  "heartRate": 72.0,
  "bloodPressure": "120/80",
  "weight": 70.5,
  "height": 175.0,
  "recordedAt": "2026-04-10T08:30:00Z"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| heartRate | float | No | 0 < x < 400 |
| bloodPressure | string | No | — |
| weight | float | No | > 0 |
| height | float | No | > 0 |
| recordedAt | DateTime | **Yes** | — |

**Response `200 OK`:** `VitalsResponse`

---

#### `GET /api/patients/{patientId}/vitals`

**Auth required:** Admin, Doctor, LabTech  
**Query:** `pageNumber`, `pageSize`

**Response:** Paged list of `VitalsResponse`

---

#### `DELETE /api/patients/{patientId}/vitals/{vitalId}`

**Auth required:** Admin, Doctor  
Permanent delete only — vitals have no soft delete.

---

### Doctors

#### `POST /api/doctors`

**Auth required:** Admin  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| firstName | string | Yes | max 100 |
| lastName | string | Yes | max 100 |
| username | string | Yes | max 50, unique |
| password | string | Yes | min 8 |
| email | string | No | valid email, max 320 |
| phone | string | No | max 30 |
| birthDate | DateOnly | Yes | — |
| gender | int | Yes | 1 or 2 (not NotSet) |
| bloodType | int | No | — |
| bio | string | No | — |
| medicalLicenseNumber | string | Yes | max 100, unique |
| departmentId | uuid | Yes | Must exist |
| consultationCharge | decimal | No | >= 0 |
| yearsOfExperience | int | Yes | >= 0 |
| location | string | No | — |
| image | file | No | — |

**Response `200 OK`:** `DoctorResponse`

```json
{
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "isActive": true,
    "phone": "string",
    "birthDate": "1985-03-20",
    "gender": 1,
    "bloodType": 0,
    "bio": "string",
    "medicalLicenseNumber": "string",
    "departmentId": "uuid",
    "department": { "id": "uuid", "title": "string" },
    "consultationCharge": 50000,
    "yearsOfExperience": 10,
    "location": "string",
    "imageUrl": "string",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/doctors`

**Auth required:** Admin, Doctor

| Filter | Type | Match |
|--------|------|-------|
| firstName | string | LIKE |
| lastName | string | LIKE |
| email | string | LIKE |
| departmentId | uuid | Exact |
| isActive | bool | Exact |

**Response:** Paged list of `DoctorResponse`

---

#### `GET /api/doctors/{id}`

**Auth required:** Admin, Doctor

**Response `200 OK`:** Single `DoctorResponse`

---

#### `PUT /api/doctors/{id}`

**Auth required:** Admin  
All fields optional. To change password, provide both `currentPassword` and `newPassword`.

| Field | Notes |
|-------|-------|
| currentPassword | Required when changing password |
| newPassword | min 8, requires `currentPassword` |

---

#### `PUT /api/doctors/{id}/profile`

**Auth required:** Doctor only (own profile)  
Same request shape as admin update. Server verifies the token's user ID matches `{id}`.

---

#### `DELETE /api/doctors/{id}/soft` — Soft delete (Admin)
#### `PATCH  /api/doctors/{id}/soft` — Restore (Admin)
#### `DELETE /api/doctors/{id}` — Permanent delete (Admin)

---

### Doctor Education

Base path: `/api/doctors/{doctorId}/education`

#### `POST /api/doctors/{doctorId}/education`

**Auth required:** Admin

```json
{
  "degree": "string (max 200)",
  "institution": "string (max 300)",
  "year": 2010
}
```

Year must be between 1900 and 2100 if provided.

**Response `200 OK`:** `EducationResponse`
```json
{
  "data": {
    "id": "uuid",
    "doctorId": "uuid",
    "degree": "string",
    "institution": "string",
    "year": 2010,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/doctors/{doctorId}/education`

**Auth required:** Admin, Doctor  
**Query:** `pageNumber`, `pageSize`

---

#### `PUT /api/doctors/{doctorId}/education/{entryId}`

**Auth required:** Admin — all fields optional.

---

#### `DELETE /api/doctors/{doctorId}/education/{entryId}`

**Auth required:** Admin — permanent delete only.

---

### Doctor Availability

Base path: `/api/doctors/{doctorId}/availability`

#### `POST /api/doctors/{doctorId}/availability`

**Auth required:** Admin

```json
{
  "dayOfWeek": 0,
  "startTime": "09:00:00",
  "endTime": "17:00:00"
}
```

`endTime` must be after `startTime`.

**Response `200 OK`:** `AvailabilityResponse`
```json
{
  "data": {
    "id": "uuid",
    "doctorId": "uuid",
    "dayOfWeek": 0,
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/doctors/{doctorId}/availability`

**Auth required:** Admin, Doctor  
**Query:** `pageNumber`, `pageSize`

---

#### `PUT /api/doctors/{doctorId}/availability/{slotId}`

**Auth required:** Admin — all fields optional.

---

#### `DELETE /api/doctors/{doctorId}/availability/{slotId}`

**Auth required:** Admin — permanent delete only.

---

### Admins

> All Admin endpoints require **Admin** or **SuperAdmin** role.

#### `POST /api/admins`

**Content-Type:** `multipart/form-data`

| Field | Required | Validation |
|-------|----------|------------|
| firstName | Yes | max 100 |
| lastName | Yes | max 100 |
| username | Yes | max 50, unique |
| email | Yes | valid email, max 320 |
| password | Yes | min 8 |
| image | No | — |

**Response `200 OK`:** `AdminResponse`
```json
{
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "isActive": true,
    "isSuperAdmin": false,
    "imageUrl": "string",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/admins`

| Filter | Type | Match |
|--------|------|-------|
| firstName | string | LIKE |
| lastName | string | LIKE |
| email | string | LIKE |
| isActive | bool | Exact |

---

#### `GET /api/admins/{id}` — Single admin
#### `PUT /api/admins/{id}` — Update (multipart, all optional)
#### `DELETE /api/admins/{id}/soft` — Soft delete
#### `PATCH  /api/admins/{id}/soft` — Restore
#### `DELETE /api/admins/{id}` — Permanent delete

---

### Lab Techs

> All Lab Tech management endpoints require **Admin** or **SuperAdmin** role.

#### `POST /api/lab-techs`

**Content-Type:** `multipart/form-data`

| Field | Required | Validation |
|-------|----------|------------|
| firstName | Yes | max 100 |
| lastName | Yes | max 100 |
| username | Yes | max 50, unique |
| email | Yes | valid email, max 320 |
| password | Yes | min 8 |
| phone | No | max 30 |
| labId | No | Must exist if provided |
| image | No | — |

**Response `200 OK`:** `LabTechResponse`
```json
{
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "phone": "string",
    "isActive": true,
    "imageUrl": "string",
    "lab": { "id": "uuid", "name": "string" },
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` Validation, `404` Lab not found, `409` Conflict (username/email in use)

---

#### `GET /api/lab-techs`

| Filter | Type | Match |
|--------|------|-------|
| firstName | string | LIKE |
| lastName | string | LIKE |
| email | string | LIKE |
| isActive | bool | Exact |

---

#### `GET /api/lab-techs/{id}`
#### `PUT /api/lab-techs/{id}` — Update (multipart, all optional)
#### `DELETE /api/lab-techs/{id}/soft` — Soft delete
#### `PATCH  /api/lab-techs/{id}/soft` — Restore
#### `DELETE /api/lab-techs/{id}` — Permanent delete

---

### Departments

#### `POST /api/departments`

**Auth required:** Admin

```json
{
  "title": "string (max 200, unique)"
}
```

**Response `200 OK`:** `DepartmentResponse`
```json
{
  "data": {
    "id": "uuid",
    "title": "string",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` Duplicate title

---

#### `GET /api/departments`

**Auth required:** Admin, Doctor, LabTech

| Filter | Type | Match |
|--------|------|-------|
| title | string | LIKE |

---

#### `GET /api/departments/{id}` — (Admin, Doctor, LabTech)
#### `PUT /api/departments/{id}` — Update title (Admin)
#### `DELETE /api/departments/{id}/soft` — Soft delete (Admin)
#### `PATCH  /api/departments/{id}/soft` — Restore (Admin)
#### `DELETE /api/departments/{id}` — Permanent delete (Admin) — `400` if department has doctors

---

### Labs

#### `POST /api/labs`

**Auth required:** Admin, LabTech

```json
{
  "name": "string (max 200, unique)",
  "location": "string (optional)",
  "contactPhone": "string (optional, max 30)"
}
```

**Response `200 OK`:** `LabResponse`
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "location": "string",
    "contactPhone": "string",
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/labs`

**Auth required:** Admin, Doctor, LabTech

| Filter | Type | Match |
|--------|------|-------|
| name | string | LIKE |
| location | string | LIKE |

---

#### `GET /api/labs/{id}` — (Admin, Doctor, LabTech)
#### `PUT /api/labs/{id}` — Update (Admin, LabTech)
#### `DELETE /api/labs/{id}/soft` — Soft delete (Admin, LabTech)
#### `PATCH  /api/labs/{id}/soft` — Restore (Admin only)
#### `DELETE /api/labs/{id}` — Permanent delete (Admin only) — `400` if lab has lab techs

---

### Appointments

#### `POST /api/appointments`

**Auth required:** Admin, Doctor

```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "dateTime": "2026-04-15T10:00:00Z",
  "type": 0,
  "reason": "string (optional, max 500)"
}
```

**Response `200 OK`:** `AppointmentResponse`
```json
{
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "patient": { "id": "uuid", "firstName": "string", "lastName": "string" },
    "doctorId": "uuid",
    "doctor": { "id": "uuid", "firstName": "string", "lastName": "string" },
    "dateTime": "2026-04-15T10:00:00Z",
    "type": 0,
    "status": 0,
    "reason": "string",
    "notes": null,
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` Validation / scheduling conflict, `404` Patient or Doctor not found

---

#### `GET /api/appointments`

**Auth required:** Admin only

| Filter | Type | Match |
|--------|------|-------|
| patientId | uuid | Exact |
| doctorId | uuid | Exact |
| status | int | Exact |
| dateFrom | DateTime | >= |
| dateTo | DateTime | <= |

---

#### `GET /api/appointments/{id}`

**Auth required:** Admin, Doctor

---

#### `GET /api/appointments/patient/{patientId}`

**Auth required:** Admin, Doctor  
**Query:** Standard pagination + appointment filters

---

#### `GET /api/appointments/doctor/{doctorId}`

**Auth required:** Admin, Doctor  
**Query:** Standard pagination + appointment filters

---

#### `PUT /api/appointments/{id}/status`

**Auth required:** Admin, Doctor

```json
{
  "status": 1,
  "notes": "string (optional, max 1000)"
}
```

Status transition flow:
```
Scheduled (0) → Confirmed (1) → CheckedIn (2) → CheckedOut (3)
                                              ↘ Cancelled (4)
```

---

#### `DELETE /api/appointments/{id}/soft` — Soft delete (Admin, Doctor)
#### `PATCH  /api/appointments/{id}/soft` — Restore (Admin, Doctor)
#### `DELETE /api/appointments/{id}` — Permanent delete (Admin, Doctor)

---

### Enums Endpoints

All enum endpoints are public (no auth required).

```
GET /api/enums/app-roles
GET /api/enums/gender
GET /api/enums/week-days
GET /api/enums/blood-type
GET /api/enums/patient-status
GET /api/enums/allergy-severity
GET /api/enums/appointment-type
GET /api/enums/appointment-status
```

Each returns:
```json
{
  "isSuccess": true,
  "data": [
    { "id": 0, "name": "NotSet", "value": "غير محدد" },
    { "id": 1, "name": "Male", "value": "ذكر" },
    { "id": 2, "name": "Female", "value": "انثى" }
  ]
}
```

---

## Common Error Codes Summary

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Success |
| `400` | Validation error, duplicate value, or business rule violation |
| `401` | Missing or invalid token |
| `403` | Valid token but insufficient role |
| `404` | Resource not found |
| `409` | Conflict (e.g., username or email already taken) |
| `429` | Rate limit exceeded (100 requests/minute per IP) |
| `500` | Internal server error |

---

## Quick Start Checklist

- [ ] Store `accessToken` from login response in secure storage (httpOnly cookie or memory — avoid localStorage)
- [ ] Attach `Authorization: Bearer <token>` to every request
- [ ] Store `role` to drive UI permission checks client-side
- [ ] Fetch all enums on app init and cache them
- [ ] Use `id` (integer) when sending enum values; use `value` (Arabic string) for display
- [ ] Use `multipart/form-data` for all endpoints that include an `image` field
- [ ] Handle `isSuccess: false` globally and show `errorMessage` to the user
- [ ] Use `totalPages` from paginated responses to build pagination controls
- [ ] Remember: `PATCH /{id}/soft` = restore, `DELETE /{id}/soft` = soft delete, `DELETE /{id}` = permanent
