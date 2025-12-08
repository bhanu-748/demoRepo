# Employee Dashboard - Documentation

## 🎉 Dashboard Features

Your new Employee Dashboard is fully functional with the following features:

### 1. **Overview Tab** 📊
   - Welcome greeting with employee name
   - 4 Key Statistics Cards:
     - Leaves Used (9/25 days)
     - Monthly Hours (160 hours)
     - Active Projects (2 projects)
     - Performance Rating (4.8/5)
   - Recent Leaves Section
   - Recent Timesheets Section

### 2. **Leave Management** 🏖️
   - View all submitted leaves with status
   - Apply for new leaves with:
     - Leave Type (Casual, Sick, Annual, Maternity)
     - Start and End Date
     - Reason for leave
   - Leave status tracking (Approved/Pending)
   - Number of leave days calculation
   - Table view with search functionality

### 3. **Timesheets** ⏱️
   - Daily timesheet tracking
   - Hours worked per day
   - Project assignment
   - Status tracking (Submitted/Approved)
   - Searchable timesheet records

### 4. **Project Allocations** 📋
   - View all active project allocations
   - Allocation percentage display
   - Role information
   - Project start and end dates
   - Visual progress bars for allocation percentage

### 5. **Employee Profile** 👤
   - Employee ID generation
   - Name and email display
   - Department (Engineering)
   - Designation (Software Developer)
   - Joining date
   - Location information

## 🔍 Search Functionality

The global search bar allows you to search across all sections:
- **Leaves Tab**: Search by leave type or status
- **Timesheets Tab**: Search by project name or status
- **Allocations Tab**: Search by project name or role
- **Real-time filtering** as you type

## 🎨 UI Features

### Design Highlights:
- **Modern Gradient Design**: Purple/Blue gradient color scheme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Clean Typography**: Professional font hierarchy
- **Cards & Sections**: Organized content structure
- **Status Badges**: Color-coded status indicators
  - Green for Approved
  - Yellow for Pending
  - Blue for Submitted

### Header Features:
- Company logo "EmpHub"
- Quick user info display
- One-click logout button
- Sticky header for easy navigation

### Sidebar Navigation:
- Icon-based navigation menu
- Active tab highlighting
- Smooth transitions
- Mobile-optimized (collapsible)

## 🚀 How It Works

### Login Flow:
1. User enters email and password on the auth page
2. Backend validates credentials
3. User data stored in localStorage
4. Automatic redirect to Dashboard
5. Dashboard loads with user's information

### Leave Application:
1. Click "Apply Leave" button
2. Fill out form with:
   - Leave type
   - Start date
   - End date
   - Reason
3. Submit application
4. Leave appears in table with "Pending" status
5. Can be approved by manager

### Search:
1. Type in search box at top of dashboard
2. Results filter in real-time across active tab
3. Search across multiple fields:
   - Leave type, status, project name, role, etc.

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop (1024px+)**: Full sidebar + content
- **Tablet (768px-1023px)**: Horizontal navigation
- **Mobile (< 768px)**: Stacked layout with minimal icons

## 🔐 Security Features

- User authentication required
- Logout functionality to clear session
- User data stored in localStorage
- Protected dashboard access (redirects to login if not authenticated)

## 📊 Sample Data

Dashboard comes with sample data:
- **Leaves**: 2 pre-populated leave records
- **Timesheets**: 3 recent timesheet entries
- **Allocations**: 2 active project allocations
- All data can be modified/extended via API integration

## 🔗 Backend Integration Ready

The Dashboard is ready to connect to backend APIs for:
- Fetching actual user leaves
- Submitting new leave requests
- Retrieving timesheet data
- Getting project allocations
- User profile information

### API Endpoints to Integrate:
```
GET  /api/leaves           - Get all leaves
POST /api/leaves           - Submit new leave
GET  /api/timesheets       - Get timesheets
POST /api/timesheets       - Submit timesheet
GET  /api/allocations      - Get project allocations
GET  /api/profile          - Get user profile
```

## 🎯 Future Enhancements

Potential features to add:
- [ ] Export reports (PDF/Excel)
- [ ] Email notifications
- [ ] Approval workflow
- [ ] File uploads (documents)
- [ ] Calendar view for leaves
- [ ] Analytics & charts
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Notifications system

## ⚙️ Installation & Setup

```bash
# Frontend
cd c:\Users\16845\myApp\frontend
npm install
npm start

# Backend
cd c:\Users\16845\backend
npm install
npm run dev
```

## 🎓 File Structure

```
frontend/src/
├── AuthPage.jsx          # Login & Register
├── AuthPage.css          # Auth styling
├── Dashboard.jsx         # Main dashboard component
├── Dashboard.css         # Dashboard styling
├── App.jsx              # App routing logic
├── App.css              # App styling
└── index.js             # Entry point
```

## 💡 Key Technologies

- **React 18**: Frontend framework
- **CSS3**: Modern styling with gradients & animations
- **localStorage**: Data persistence
- **Responsive Design**: Mobile-first approach
- **ES6+**: Modern JavaScript

## 📞 Support

For any issues or questions, check:
1. Browser console for errors
2. Backend server is running on port 5000
3. Frontend is running on port 3000
4. localStorage has user data

---

**Dashboard Version**: 1.0.0  
**Last Updated**: December 8, 2025
