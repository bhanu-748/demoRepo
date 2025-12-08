# Leave Management System - Setup Guide

## Overview
This guide explains how to set up and use the leave management system that stores leave applications in the database.

## Backend Changes

### 1. New Files Created
- **`model/leaveModel.js`** - Sequelize model for Leave table
- **`controller/leaveController.js`** - Leave API endpoints logic
- **`router/leaveRouter.js`** - Route definitions for leave endpoints
- **`migrations/createLeavesTable.js`** - Database table creation script

### 2. Modified Files
- **`server.js`** - Added leave routes to the Express app

## Database Setup

### Step 1: Create PostgreSQL Table
Run this command to create the `leaves` table in your PostgreSQL database:

```bash
node backend/migrations/createLeavesTable.js
```

This creates a table with the following structure:
```
leaves (
  id: INTEGER (Primary Key),
  user_id: INTEGER (Foreign Key to users),
  leave_type: STRING (Casual Leave, Sick Leave, Annual Leave, Maternity Leave),
  start_date: DATE,
  end_date: DATE,
  reason: TEXT,
  days: INTEGER,
  status: STRING (Pending, Approved, Rejected),
  created_at: DATE,
  updated_at: DATE
)
```

## API Endpoints

### 1. Apply for Leave
**Endpoint:** `POST /api/leaves/apply`

**Request Body:**
```json
{
  "user_id": 1,
  "leave_type": "Casual Leave",
  "start_date": "2025-12-15",
  "end_date": "2025-12-17",
  "reason": "Personal reasons"
}
```

**Response:**
```json
{
  "message": "Leave application submitted successfully",
  "leave": {
    "id": 1,
    "user_id": 1,
    "leave_type": "Casual Leave",
    "start_date": "2025-12-15T00:00:00.000Z",
    "end_date": "2025-12-17T00:00:00.000Z",
    "reason": "Personal reasons",
    "days": 3,
    "status": "Pending",
    "created_at": "2025-12-08T...",
    "updated_at": "2025-12-08T..."
  }
}
```

### 2. Get All Leaves for User
**Endpoint:** `GET /api/leaves/user/:user_id`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "leave_type": "Casual Leave",
    "start_date": "2025-12-15T00:00:00.000Z",
    "end_date": "2025-12-17T00:00:00.000Z",
    "reason": "Personal reasons",
    "days": 3,
    "status": "Pending",
    ...
  }
]
```

### 3. Get All Leaves (Admin)
**Endpoint:** `GET /api/leaves`

**Response:** Array of all leaves with user information

### 4. Get Leave by ID
**Endpoint:** `GET /api/leaves/:id`

**Response:** Single leave object with user details

### 5. Update Leave Status (Admin)
**Endpoint:** `PUT /api/leaves/:id/status`

**Request Body:**
```json
{
  "status": "Approved"
}
```

**Valid Statuses:** `Pending`, `Approved`, `Rejected`

### 6. Delete Leave
**Endpoint:** `DELETE /api/leaves/:id`

**Note:** Can only delete leave applications with "Pending" status

## Frontend Changes

### Dashboard.js Updates
- Added API integration using `fetch()`
- Added loading state and error handling
- Loads leaves from backend on component mount
- Submits leave applications to backend API
- Displays success/error messages

### Environment Variable (Optional)
Add to `.env` file in frontend:
```
REACT_APP_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## Testing the Leave Application

### Manual Testing Steps:

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Create Leaves Table:**
   ```bash
   node migrations/createLeavesTable.js
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Test Leave Application:**
   - Login to dashboard
   - Go to "Leaves" tab
   - Click "Apply Leave"
   - Fill in the form:
     - Leave Type: Select any option
     - Start Date: Choose a date
     - End Date: Choose a later date
     - Reason: Enter a reason
   - Click "Submit Application"
   - You should see a success message
   - The leave should appear in the table below

### Using cURL (Backend Testing):

```bash
# Apply for leave
curl -X POST http://localhost:5000/api/leaves/apply \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "leave_type": "Sick Leave",
    "start_date": "2025-12-15",
    "end_date": "2025-12-17",
    "reason": "Medical appointment"
  }'

# Get user leaves
curl http://localhost:5000/api/leaves/user/1

# Update leave status
curl -X PUT http://localhost:5000/api/leaves/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}'

# Delete leave
curl -X DELETE http://localhost:5000/api/leaves/1
```

## Error Handling

The API includes comprehensive error handling:
- **400** - Bad Request (missing required fields, invalid data)
- **404** - Not Found (user or leave not found)
- **500** - Internal Server Error (database issues)

## Database Schema Relationships

```
Users (1) ──── (Many) Leaves
  ├─ User.hasMany(Leave)
  └─ Leave.belongsTo(User)
```

When a user is deleted, all their associated leaves are automatically deleted (CASCADE).

## Security Notes

For production, consider adding:
- Authentication middleware to verify user identity
- Authorization checks to ensure users can only manage their own leaves
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS restrictions

## Troubleshooting

### Leaves table not created?
- Ensure PostgreSQL is running
- Check `.env` file has correct database credentials
- Run: `node backend/migrations/createLeavesTable.js`

### API not responding?
- Check backend server is running on port 5000
- Verify CORS is enabled in server.js
- Check for console errors

### Frontend not showing leaves?
- Check browser console for errors
- Verify user is logged in
- Ensure user.id is correctly stored in localStorage
- Check network tab in DevTools for API requests

## Next Steps

1. Add edit leave functionality
2. Implement leave approval workflow
3. Add email notifications
4. Create admin dashboard for leave approvals
5. Add leave balance tracking
6. Implement leave calendar view
