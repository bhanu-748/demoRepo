# Leave Management System - Implementation Summary

## ✅ What Has Been Implemented

### Backend Files Created:

1. **`model/leaveModel.js`**
   - Sequelize model for Leave data
   - Defines columns: id, user_id, leave_type, start_date, end_date, reason, days, status
   - Sets up User-Leave relationship (One User → Many Leaves)

2. **`controller/leaveController.js`**
   - 6 main functions:
     - `applyLeave()` - Submit new leave application
     - `getUserLeaves()` - Fetch leaves for specific user
     - `getAllLeaves()` - Fetch all leaves (admin)
     - `getLeaveById()` - Get single leave details
     - `updateLeaveStatus()` - Approve/Reject leave (admin)
     - `deleteLeave()` - Delete pending leave application

3. **`router/leaveRouter.js`**
   - Route definitions for all leave endpoints
   - Maps HTTP methods to controller functions

4. **`migrations/createLeavesTable.js`**
   - Utility script to create leaves table in database
   - Run once during setup

### Backend File Modified:

- **`server.js`**
  - Added leave router import
  - Registered `/api/leaves` route

### Frontend File Modified:

- **`Dashboard.js`**
  - Integrated `fetchUserLeaves()` to load leaves from API on mount
  - Updated `handleApplyLeave()` to send data to backend API
  - Added loading state and error handling
  - Added success/error message display

## 🚀 Quick Start

### 1. Create Database Table:
```bash
cd backend
node migrations/createLeavesTable.js
```

### 2. Start Backend:
```bash
npm run dev
```

### 3. Start Frontend:
```bash
cd frontend
npm start
```

### 4. Test:
- Login to dashboard
- Go to Leaves tab
- Click "Apply Leave"
- Fill form and submit
- Data is saved to PostgreSQL database

## 📊 Database Schema

```
leaves TABLE:
├─ id (PK)
├─ user_id (FK → users)
├─ leave_type (Casual/Sick/Annual/Maternity)
├─ start_date
├─ end_date
├─ reason
├─ days (auto-calculated)
├─ status (Pending/Approved/Rejected)
├─ created_at
└─ updated_at
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/leaves/apply` | Submit leave application |
| GET | `/api/leaves/user/:user_id` | Get user's leaves |
| GET | `/api/leaves` | Get all leaves (admin) |
| GET | `/api/leaves/:id` | Get specific leave |
| PUT | `/api/leaves/:id/status` | Approve/Reject leave |
| DELETE | `/api/leaves/:id` | Delete leave (only pending) |

## 💾 Data Flow

```
Frontend Form
     ↓
handleApplyLeave() function
     ↓
POST /api/leaves/apply
     ↓
LeaveController.applyLeave()
     ↓
Leave.create() in database
     ↓
Return success response
     ↓
Update frontend state (leaves list)
     ↓
Display success message
```

## ✨ Features Included

✅ Create leave application with validation
✅ Store data in PostgreSQL database
✅ Retrieve user's leave history
✅ Calculate leave days automatically
✅ Track leave status (Pending/Approved/Rejected)
✅ Error handling and user feedback
✅ Loading states during API calls
✅ Real-time updates in UI
✅ User-Leave relationship with cascade delete

## 📝 Example Leave Application

When user submits:
```
Leave Type: "Sick Leave"
Start Date: "2025-12-15"
End Date: "2025-12-17"
Reason: "Medical appointment"
```

Stored in database as:
```
{
  id: 3,
  user_id: 1,
  leave_type: "Sick Leave",
  start_date: "2025-12-15",
  end_date: "2025-12-17",
  reason: "Medical appointment",
  days: 3,
  status: "Pending",
  created_at: "2025-12-08T10:30:00.000Z",
  updated_at: "2025-12-08T10:30:00.000Z"
}
```

## 🔐 Validation

- Required fields: user_id, leave_type, start_date, end_date, reason
- Valid leave types: Casual Leave, Sick Leave, Annual Leave, Maternity Leave
- End date must be after start date
- Days calculated: `(endDate - startDate) + 1`
- User must exist in database

## 📚 Additional Resources

See `LEAVE_SETUP_GUIDE.md` for:
- Detailed endpoint documentation
- cURL examples for testing
- Security recommendations
- Troubleshooting guide
- Future enhancement ideas
