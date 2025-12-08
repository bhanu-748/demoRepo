# Timesheet Management System - Setup Guide

## Overview
This guide explains how to set up and use the timesheet management system that stores timesheet data in the database.

## Backend Files Created

### 1. Model - `model/timesheetModel.js`
- Sequelize model for Timesheet table
- Columns: id, user_id, date, project, hours_worked, description, status, created_at, updated_at
- Establishes User-Timesheet relationship (One User → Many Timesheets)

### 2. Controller - `controller/timesheetController.js`
- 7 main functions:
  - `submitTimesheet()` - Submit new timesheet
  - `getUserTimesheets()` - Fetch timesheets for specific user
  - `getAllTimesheets()` - Fetch all timesheets (admin)
  - `getTimesheetById()` - Get single timesheet details
  - `updateTimesheetStatus()` - Approve/Reject timesheet (admin)
  - `deleteTimesheet()` - Delete submitted timesheet
  - `getTimesheetsByDateRange()` - Query timesheets by date range

### 3. Router - `router/timesheetRouter.js`
- Route definitions for all timesheet endpoints
- Maps HTTP methods to controller functions

### 4. Migration - `migrations/createTimesheetsTable.js`
- Utility script to create timesheets table in database

## Database Setup

### Step 1: Create PostgreSQL Table
Run this command to create the `timesheets` table:

```bash
node backend/migrations/createTimesheetsTable.js
```

Or manually create it with this SQL:

```sql
CREATE TABLE timesheets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  project VARCHAR(255) NOT NULL,
  hours_worked DECIMAL(4,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Submit Timesheet
**Endpoint:** `POST /api/timesheets/submit`

**Request Body:**
```json
{
  "user_id": 1,
  "date": "2025-12-08",
  "project": "Project Alpha",
  "hours_worked": 8.5,
  "description": "Developed user authentication module"
}
```

**Response:**
```json
{
  "message": "Timesheet submitted successfully",
  "timesheet": {
    "id": 1,
    "user_id": 1,
    "date": "2025-12-08T00:00:00.000Z",
    "project": "Project Alpha",
    "hours_worked": 8.5,
    "description": "Developed user authentication module",
    "status": "Submitted",
    "created_at": "2025-12-08T10:30:00.000Z",
    "updated_at": "2025-12-08T10:30:00.000Z"
  }
}
```

### 2. Get User's Timesheets
**Endpoint:** `GET /api/timesheets/user/:user_id`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "date": "2025-12-08T00:00:00.000Z",
    "project": "Project Alpha",
    "hours_worked": 8.5,
    "description": "Developed user authentication module",
    "status": "Submitted",
    ...
  }
]
```

### 3. Get All Timesheets (Admin)
**Endpoint:** `GET /api/timesheets`

**Response:** Array of all timesheets with user information

### 4. Get Timesheet by ID
**Endpoint:** `GET /api/timesheets/:id`

**Response:** Single timesheet object with user details

### 5. Get Timesheets by Date Range
**Endpoint:** `GET /api/timesheets/range/query?start_date=2025-12-01&end_date=2025-12-31&user_id=1`

**Response:** Filtered timesheets for the specified date range

### 6. Update Timesheet Status (Admin)
**Endpoint:** `PUT /api/timesheets/:id/status`

**Request Body:**
```json
{
  "status": "Approved"
}
```

**Valid Statuses:** `Submitted`, `Approved`, `Rejected`

### 7. Delete Timesheet
**Endpoint:** `DELETE /api/timesheets/:id`

**Note:** Can only delete timesheet with "Submitted" status

## Database Schema

```
timesheets TABLE:
├─ id (PK)
├─ user_id (FK → users)
├─ date
├─ project
├─ hours_worked (0-24)
├─ description
├─ status (Submitted/Approved/Rejected)
├─ created_at
└─ updated_at
```

## Validation Rules

- **hours_worked:** Must be between 0 and 24
- **user_id:** User must exist in database
- **date:** Must be valid date format
- **project:** Required field
- **Description:** Optional field

## Testing with cURL

```bash
# Submit timesheet
curl -X POST http://localhost:5000/api/timesheets/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "date": "2025-12-08",
    "project": "Project Beta",
    "hours_worked": 9,
    "description": "Fixed bugs in payment module"
  }'

# Get user timesheets
curl http://localhost:5000/api/timesheets/user/1

# Get timesheets by date range
curl "http://localhost:5000/api/timesheets/range/query?start_date=2025-12-01&end_date=2025-12-31&user_id=1"

# Update timesheet status
curl -X PUT http://localhost:5000/api/timesheets/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}'

# Delete timesheet
curl -X DELETE http://localhost:5000/api/timesheets/1
```

## Frontend Integration

The Dashboard component includes:
- `handleSubmitTimesheet()` function to submit data to API
- `fetchUserTimesheets()` function to load timesheets on mount
- Real-time state updates after submission
- Error handling and loading states
- Success/error alerts

## Troubleshooting

### Table not created?
- Ensure PostgreSQL is running
- Check `.env` file has correct database credentials
- Run: `node backend/migrations/createTimesheetsTable.js`

### API returning 500 error?
- Check backend server is running
- Verify timesheets table exists in database
- Check console logs for detailed error messages

### Frontend can't connect to API?
- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled in server.js
- Verify API endpoint URL in frontend code

## Next Steps

1. Add edit timesheet functionality
2. Implement timesheet approval workflow
3. Add weekly/monthly timesheet summaries
4. Create timesheet reports
5. Add project-wise hour tracking
6. Implement timesheet notifications
