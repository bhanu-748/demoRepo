import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2025-12-10', endDate: '2025-12-12', status: 'Approved', days: 3 },
    { id: 2, type: 'Annual Leave', startDate: '2025-12-20', endDate: '2025-12-25', status: 'Pending', days: 6 },
  ]);
  const [timesheets, setTimesheets] = useState([
    { id: 1, date: '2025-12-07', hoursWorked: 8.5, project: 'Project Alpha', status: 'Submitted' },
    { id: 2, date: '2025-12-06', hoursWorked: 9, project: 'Project Beta', status: 'Approved' },
    { id: 3, date: '2025-12-05', hoursWorked: 7.5, project: 'Project Alpha', status: 'Approved' },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [allocations, setAllocations] = useState([
    { id: 1, projectName: 'Project Alpha', role: 'Senior Developer', startDate: '2025-01-15', endDate: '2025-12-31', allocation: '80%' },
    { id: 2, projectName: 'Project Beta', role: 'Tech Lead', startDate: '2025-06-01', endDate: '2025-12-31', allocation: '20%' },
  ]);
  const [applyLeaveForm, setApplyLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [submitTimesheetForm, setSubmitTimesheetForm] = useState({
    date: '',
    project: '',
    hoursWorked: '',
    description: '',
  });
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [loadingTimesheet, setLoadingTimesheet] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      const userId = JSON.parse(userData).id;
      fetchUserLeaves(userId);
      fetchUserTimesheets(userId);
    } else {
      window.location.href = '/';
    }
  }, []);

  // Fetch leaves from backend
  const fetchUserLeaves = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/leaves/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedLeaves = data.map(leave => ({
          id: leave.id,
          type: leave.leave_type,
          startDate: leave.start_date.split('T')[0],
          endDate: leave.end_date.split('T')[0],
          status: leave.status,
          days: leave.days,
        }));
        setLeaves(transformedLeaves);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  // Fetch timesheets from backend
  const fetchUserTimesheets = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/timesheets/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedTimesheets = data.map(sheet => ({
          id: sheet.id,
          date: new Date(sheet.date).toISOString().split('T')[0],
          hoursWorked: sheet.hours_worked,
          project: sheet.project,
          status: sheet.status,
          description: sheet.description,
        }));
        setTimesheets(transformedTimesheets);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    
    if (!applyLeaveForm.startDate || !applyLeaveForm.endDate || !applyLeaveForm.reason) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/leaves/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          leave_type: applyLeaveForm.leaveType,
          start_date: applyLeaveForm.startDate,
          end_date: applyLeaveForm.endDate,
          reason: applyLeaveForm.reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add new leave to the list
        const newLeave = {
          id: data.leave.id,
          type: data.leave.leave_type,
          startDate: data.leave.start_date.split('T')[0],
          endDate: data.leave.end_date.split('T')[0],
          status: data.leave.status,
          days: data.leave.days,
        };
        
        setLeaves([newLeave, ...leaves]);
        setApplyLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
        setShowLeaveForm(false);
        setMessage('Leave application submitted successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Error submitting leave application');
      }
    } catch (error) {
      console.error('Error submitting leave application:', error);
      setMessage('Error submitting leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTimesheet = async (e) => {
    e.preventDefault();
    if (!submitTimesheetForm.date || !submitTimesheetForm.project || !submitTimesheetForm.hoursWorked) {
      alert('Please fill all required fields');
      return;
    }

    const hours = parseFloat(submitTimesheetForm.hoursWorked);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      alert('Please enter valid hours (0-24)');
      return;
    }

    setLoadingTimesheet(true);

    try {
      const response = await fetch(`${API_URL}/timesheets/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          date: submitTimesheetForm.date,
          project: submitTimesheetForm.project,
          hours_worked: hours,
          description: submitTimesheetForm.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to submit timesheet');
        setLoadingTimesheet(false);
        return;
      }

      // Add new timesheet to the list
      const newTimesheet = {
        id: data.timesheet.id,
        date: new Date(data.timesheet.date).toISOString().split('T')[0],
        hoursWorked: data.timesheet.hours_worked,
        project: data.timesheet.project,
        status: data.timesheet.status,
        description: data.timesheet.description,
      };

      setTimesheets([newTimesheet, ...timesheets]);
      setSubmitTimesheetForm({ date: '', project: '', hoursWorked: '', description: '' });
      setShowTimesheetForm(false);
      alert('Timesheet submitted successfully!');
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      alert('Error connecting to server');
    } finally {
      setLoadingTimesheet(false);
    }
  };

  const getFilteredData = (data, searchFields) => {
    return data.filter(item =>
      searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredLeaves = getFilteredData(leaves, ['type', 'status']);
  const filteredTimesheets = getFilteredData(timesheets, ['project', 'status']);
  const filteredAllocations = getFilteredData(allocations, ['projectName', 'role']);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">EmpHub</div>
          <div className="header-title">Employee Dashboard</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span> Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaves')}
            >
              <span className="nav-icon">🏖️</span> Leaves
            </button>
            <button
              className={`nav-item ${activeTab === 'timesheets' ? 'active' : ''}`}
              onClick={() => setActiveTab('timesheets')}
            >
              <span className="nav-icon">⏱️</span> Timesheets
            </button>
            <button
              className={`nav-item ${activeTab === 'allocations' ? 'active' : ''}`}
              onClick={() => setActiveTab('allocations')}
            >
              <span className="nav-icon">📋</span> Allocations
            </button>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span> Profile
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Message Display */}
          {message && (
            <div className={`message ${message.includes('Error') || message.includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search across all sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="content-section">
              <h2>Welcome, {user.name}! 👋</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏖️</div>
                  <div className="stat-content">
                    <p className="stat-label">Leaves Used</p>
                    <p className="stat-value">9</p>
                    <p className="stat-subtext">Out of 25 days</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <p className="stat-label">This Month</p>
                    <p className="stat-value">160 hrs</p>
                    <p className="stat-subtext">Average 8.0 hrs/day</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <p className="stat-label">Active Projects</p>
                    <p className="stat-value">2</p>
                    <p className="stat-subtext">80% & 20% allocation</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <p className="stat-label">Performance</p>
                    <p className="stat-value">4.8/5</p>
                    <p className="stat-subtext">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <div className="overview-card">
                  <h3>Recent Leaves</h3>
                  <div className="list">
                    {leaves.slice(0, 3).map(leave => (
                      <div key={leave.id} className="list-item">
                        <div className="item-info">
                          <p className="item-title">{leave.type}</p>
                          <p className="item-date">{leave.startDate} to {leave.endDate}</p>
                        </div>
                        <span className={`badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Recent Timesheets</h3>
                  <div className="list">
                    {timesheets.slice(0, 3).map(sheet => (
                      <div key={sheet.id} className="list-item">
                        <div className="item-info">
                          <p className="item-title">{sheet.project}</p>
                          <p className="item-date">{sheet.date} - {sheet.hoursWorked}hrs</p>
                        </div>
                        <span className={`badge ${sheet.status.toLowerCase()}`}>{sheet.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Leave Management</h2>
                <button className="btn-primary" onClick={() => setShowLeaveForm(!showLeaveForm)}>
                  {showLeaveForm ? 'Cancel' : '+ Apply Leave'}
                </button>
              </div>

              {showLeaveForm && (
                <form className="form-card" onSubmit={handleApplyLeave}>
                  <h3>Apply for Leave</h3>
                  <div className="form-group">
                    <label>Leave Type</label>
                    <select
                      value={applyLeaveForm.leaveType}
                      onChange={(e) => setApplyLeaveForm({ ...applyLeaveForm, leaveType: e.target.value })}
                    >
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Annual Leave</option>
                      <option>Maternity Leave</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={applyLeaveForm.startDate}
                        onChange={(e) => setApplyLeaveForm({ ...applyLeaveForm, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={applyLeaveForm.endDate}
                        onChange={(e) => setApplyLeaveForm({ ...applyLeaveForm, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Reason</label>
                    <textarea
                      placeholder="Enter reason for leave"
                      value={applyLeaveForm.reason}
                      onChange={(e) => setApplyLeaveForm({ ...applyLeaveForm, reason: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map(leave => (
                      <tr key={leave.id}>
                        <td>{leave.type}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
                        <td>{leave.days}</td>
                        <td><span className={`badge ${leave.status.toLowerCase()}`}>{leave.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timesheets Tab */}
          {activeTab === 'timesheets' && (
            <div className="content-section">
              <h2>Timesheets</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Hours Worked</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimesheets.map(sheet => (
                      <tr key={sheet.id}>
                        <td>{sheet.date}</td>
                        <td>{sheet.project}</td>
                        <td>{sheet.hoursWorked}hrs</td>
                        <td><span className={`badge ${sheet.status.toLowerCase()}`}>{sheet.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Allocations Tab */}
          {activeTab === 'allocations' && (
            <div className="content-section">
              <h2>Project Allocations</h2>
              <div className="allocations-grid">
                {filteredAllocations.map(allocation => (
                  <div key={allocation.id} className="allocation-card">
                    <div className="allocation-header">
                      <h3>{allocation.projectName}</h3>
                      <span className="allocation-percentage">{allocation.allocation}</span>
                    </div>
                    <div className="allocation-info">
                      <p><strong>Role:</strong> {allocation.role}</p>
                      <p><strong>Start Date:</strong> {allocation.startDate}</p>
                      <p><strong>End Date:</strong> {allocation.endDate}</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: allocation.allocation }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-section">
              <h2>Employee Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <label>Employee ID:</label>
                    <span>EMP{String(user.id).padStart(5, '0')}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="detail-row">
                    <label>Department:</label>
                    <span>Engineering</span>
                  </div>
                  <div className="detail-row">
                    <label>Designation:</label>
                    <span>Software Developer</span>
                  </div>
                  <div className="detail-row">
                    <label>Joining Date:</label>
                    <span>January 15, 2023</span>
                  </div>
                  <div className="detail-row">
                    <label>Location:</label>
                    <span>New Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
