import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProfileComponent from "../components/Dashboard/Profiles/ProfileComponent";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [leaves, setLeaves] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [allocations] = useState([
    {
      id: 1,
      projectName: "Project Alpha",
      role: "Senior Developer",
      startDate: "2025-01-15",
      endDate: "2025-12-31",
      allocation: "80%",
    },
    {
      id: 2,
      projectName: "Project Beta",
      role: "Tech Lead",
      startDate: "2025-06-01",
      endDate: "2025-12-31",
      allocation: "20%",
    },
  ]);

  const [applyLeaveForm, setApplyLeaveForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [submitTimesheetForm, setSubmitTimesheetForm] = useState({
    date: "",
    project: "",
    hoursWorked: "",
    description: "",
  });

  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [loadingTimesheet, setLoadingTimesheet] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // LOAD USER + FETCH DATA
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      fetchUserLeaves(parsed.id);
      fetchUserTimesheets(parsed.id);
    } else {
      window.location.href = "/";
    }
  }, []);

  // FETCH LEAVES FROM BACKEND
  const fetchUserLeaves = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/leaves/user/${userId}`);
      if (!res.ok) return;

      const data = await res.json();
      setLeaves(
        data.map((leave) => ({
          id: leave.id,
          type: leave.leave_type,
          startDate: leave.start_date.split("T")[0],
          endDate: leave.end_date.split("T")[0],
          status: leave.status,
          days: leave.days,
        }))
      );
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // FETCH TIMESHEETS FROM BACKEND
  const fetchUserTimesheets = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/timesheets/user/${userId}`);
      if (!res.ok) return;

      const data = await res.json();

      setTimesheets(
        data.map((sheet) => ({
          id: sheet.id,
          date: new Date(sheet.date).toISOString().split("T")[0],
          hoursWorked: sheet.hours_worked,
          project: sheet.project,
          status: sheet.status,
          description: sheet.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // APPLY LEAVE
  const handleApplyLeave = async (e) => {
    e.preventDefault();

    if (!applyLeaveForm.startDate || !applyLeaveForm.endDate || !applyLeaveForm.reason) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/leaves/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          leave_type: applyLeaveForm.leaveType,
          start_date: applyLeaveForm.startDate,
          end_date: applyLeaveForm.endDate,
          reason: applyLeaveForm.reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to submit leave");
      } else {
        const newLeave = {
          id: data.leave.id,
          type: data.leave.leave_type,
          startDate: data.leave.start_date.split("T")[0],
          endDate: data.leave.end_date.split("T")[0],
          status: data.leave.status,
          days: data.leave.days,
        };

        setLeaves([newLeave, ...leaves]);
        setApplyLeaveForm({ leaveType: "Casual Leave", startDate: "", endDate: "", reason: "" });
        setShowLeaveForm(false);
        setMessage("Leave submitted successfully!");

        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT TIMESHEET
  const handleSubmitTimesheet = async (e) => {
    e.preventDefault();

    if (!submitTimesheetForm.date || !submitTimesheetForm.project || !submitTimesheetForm.hoursWorked) {
      alert("Please fill the required fields");
      return;
    }

    const hours = parseFloat(submitTimesheetForm.hoursWorked);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      alert("Enter valid hours (0–24)");
      return;
    }

    setLoadingTimesheet(true);

    try {
      const res = await fetch(`${API_URL}/timesheets/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          date: submitTimesheetForm.date,
          project: submitTimesheetForm.project,
          hours_worked: hours,
          description: submitTimesheetForm.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit");
        return;
      }

      const newSheet = {
        id: data.timesheet.id,
        date: new Date(data.timesheet.date).toISOString().split("T")[0],
        hoursWorked: data.timesheet.hours_worked,
        project: data.timesheet.project,
        status: data.timesheet.status,
        description: data.timesheet.description,
      };

      setTimesheets([newSheet, ...timesheets]);
      setSubmitTimesheetForm({ date: "", project: "", hoursWorked: "", description: "" });
      setShowTimesheetForm(false);

      alert("Timesheet submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error connecting to server");
    } finally {
      setLoadingTimesheet(false);
    }
  };

  // SEARCH UTILITY
  const getFilteredData = (data, fields) =>
    data.filter((item) =>
      fields.some((f) => item[f]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const filteredLeaves = getFilteredData(leaves, ["type", "status"]);
  const filteredTimesheets = getFilteredData(timesheets, ["project", "status"]);
  const filteredAllocations = getFilteredData(allocations, ["projectName", "role"]);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      {/* HEADER */}
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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="dashboard-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
              📊 Overview
            </button>
            <button className={`nav-item ${activeTab === "leaves" ? "active" : ""}`} onClick={() => setActiveTab("leaves")}>
              🏖️ Leaves
            </button>
            <button className={`nav-item ${activeTab === "timesheets" ? "active" : ""}`} onClick={() => setActiveTab("timesheets")}>
              ⏱️ Timesheets
            </button>
            <button className={`nav-item ${activeTab === "allocations" ? "active" : ""}`} onClick={() => setActiveTab("allocations")}>
              📋 Allocations
            </button>
            <button className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              👤 Profile
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}

          {/* SEARCH BAR */}
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

          {/* ------- OVERVIEW TAB ------- */}
          {activeTab === "overview" && (
            <div className="content-section">
              <h2>Welcome, {user.name}! 👋</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏖️</div>
                  <p className="stat-label">Leaves Used</p>
                  <p className="stat-value">9</p>
                  <p className="stat-subtext">Out of 25 days</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <p className="stat-label">This Month</p>
                  <p className="stat-value">160 hrs</p>
                  <p className="stat-subtext">Avg 8 hrs/day</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <p className="stat-label">Projects</p>
                  <p className="stat-value">2</p>
                  <p className="stat-subtext">Active</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <p className="stat-label">Performance</p>
                  <p className="stat-value">4.8 / 5</p>
                  <p className="stat-subtext">Excellent</p>
                </div>
              </div>
            </div>
          )}

          {/* ------- LEAVES TAB ------- */}
          {activeTab === "leaves" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Leave Management</h2>
                <button className="btn-primary" onClick={() => setShowLeaveForm(!showLeaveForm)}>
                  {showLeaveForm ? "Cancel" : "+ Apply Leave"}
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
                      placeholder="Enter reason"
                      value={applyLeaveForm.reason}
                      onChange={(e) => setApplyLeaveForm({ ...applyLeaveForm, reason: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.type}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
                        <td>{leave.days}</td>
                        <td>
                          <span className={`badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------- TIMESHEETS TAB (RESTORED) ------- */}
          {activeTab === "timesheets" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Timesheets</h2>
                <button className="btn-primary" onClick={() => setShowTimesheetForm(!showTimesheetForm)}>
                  {showTimesheetForm ? "Cancel" : "+ Add Timesheet"}
                </button>
              </div>

              {showTimesheetForm && (
                <form className="form-card" onSubmit={handleSubmitTimesheet}>
                  <h3>Submit Timesheet</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={submitTimesheetForm.date}
                        onChange={(e) =>
                          setSubmitTimesheetForm({ ...submitTimesheetForm, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Project</label>
                      <input
                        type="text"
                        placeholder="Enter project"
                        value={submitTimesheetForm.project}
                        onChange={(e) =>
                          setSubmitTimesheetForm({ ...submitTimesheetForm, project: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Hours Worked</label>
                      <input
                        type="number"
                        max="24"
                        min="0"
                        step="0.1"
                        value={submitTimesheetForm.hoursWorked}
                        onChange={(e) =>
                          setSubmitTimesheetForm({ ...submitTimesheetForm, hoursWorked: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="What did you work on?"
                      value={submitTimesheetForm.description}
                      onChange={(e) =>
                        setSubmitTimesheetForm({ ...submitTimesheetForm, description: e.target.value })
                      }
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loadingTimesheet}>
                    {loadingTimesheet ? "Submitting..." : "Submit Timesheet"}
                  </button>
                </form>
              )}

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimesheets.map((sheet) => (
                      <tr key={sheet.id}>
                        <td>{sheet.date}</td>
                        <td>{sheet.project}</td>
                        <td>{sheet.hoursWorked}</td>
                        <td>
                          <span className={`badge ${sheet.status.toLowerCase()}`}>
                            {sheet.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------- ALLOCATIONS TAB ------- */}
          {activeTab === "allocations" && (
            <div className="content-section">
              <h2>Project Allocations</h2>

              <div className="allocations-grid">
                {filteredAllocations.map((a) => (
                  <div key={a.id} className="allocation-card">
                    <div className="allocation-header">
                      <h3>{a.projectName}</h3>
                      <span className="allocation-percentage">{a.allocation}</span>
                    </div>
                    <p><strong>Role:</strong> {a.role}</p>
                    <p><strong>Start:</strong> {a.startDate}</p>
                    <p><strong>End:</strong> {a.endDate}</p>

                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: a.allocation }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------- PROFILE TAB ------- */}
          {activeTab === "profile" && (
            <div className="content-section">
              <ProfileComponent user={user} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
