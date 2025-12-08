import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import LeaveComponent from './components/Dashboard/Leave/LeaveComponent';
import TimesheetComponent from './components/Dashboard/Timesheet/TimesheetComponent';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  // eslint-disable-next-line no-unused-vars
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2025-12-10', endDate: '2025-12-12', status: 'Approved', days: 3, reason: 'Medical appointment' },
    { id: 2, type: 'Annual Leave', startDate: '2025-12-20', endDate: '2025-12-25', status: 'Pending', days: 6, reason: 'Vacation' },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [timesheets, setTimesheets] = useState([
    { id: 1, date: '2025-12-07', hoursWorked: 8.5, project: 'Project Alpha', status: 'Submitted', description: 'Development work' },
    { id: 2, date: '2025-12-06', hoursWorked: 9, project: 'Project Beta', status: 'Approved', description: 'Testing' },
    { id: 3, date: '2025-12-05', hoursWorked: 7.5, project: 'Project Alpha', status: 'Approved', description: 'Meetings and planning' },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [allocations, setAllocations] = useState([
    { id: 1, projectName: 'Project Alpha', role: 'Senior Developer', startDate: '2025-01-15', endDate: '2025-12-31', allocation: '80%' },
    { id: 2, projectName: 'Project Beta', role: 'Tech Lead', startDate: '2025-06-01', endDate: '2025-12-31', allocation: '20%' },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getFilteredData = (data, searchFields) => {
    return data.filter(item =>
      searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

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
              <LeaveComponent user={user} searchQuery={searchQuery} />
            </div>
          )}

          {/* Timesheets Tab */}
          {activeTab === 'timesheets' && (
            <div className="content-section">
              <TimesheetComponent user={user} searchQuery={searchQuery} />
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
