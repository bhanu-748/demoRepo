import React, { useState, useEffect } from 'react';
import './LeaveComponent.css';

function LeaveComponent({ user, searchQuery }) {
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2025-12-10', endDate: '2025-12-12', status: 'Approved', days: 3, reason: 'Medical appointment' },
    { id: 2, type: 'Annual Leave', startDate: '2025-12-20', endDate: '2025-12-25', status: 'Pending', days: 6, reason: 'Vacation' },
  ]);

  const [applyLeaveForm, setApplyLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(false);
  const API_BASE_URL = 'http://localhost:5000/api/leaves';

  useEffect(() => {
    if (user?.id) {
      fetchUserLeaves(user.id);
    }
  }, [user]);

  const fetchUserLeaves = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const transformedLeaves = data.map(leave => ({
          id: leave.id,
          type: leave.leave_type,
          startDate: new Date(leave.start_date).toISOString().split('T')[0],
          endDate: new Date(leave.end_date).toISOString().split('T')[0],
          status: leave.status,
          days: leave.days,
          reason: leave.reason,
        }));
        setLeaves(transformedLeaves);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!applyLeaveForm.startDate || !applyLeaveForm.endDate || !applyLeaveForm.reason) {
      alert('Please fill all fields');
      return;
    }

    setLoadingLeave(true);

    try {
      const response = await fetch(`${API_BASE_URL}/apply`, {
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

      if (!response.ok) {
        alert(data.error || 'Failed to submit leave application');
        setLoadingLeave(false);
        return;
      }

      const newLeave = {
        id: data.leave.id,
        type: data.leave.leave_type,
        startDate: new Date(data.leave.start_date).toISOString().split('T')[0],
        endDate: new Date(data.leave.end_date).toISOString().split('T')[0],
        status: data.leave.status,
        days: data.leave.days,
        reason: data.leave.reason,
      };

      setLeaves([newLeave, ...leaves]);
      setApplyLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      setShowLeaveForm(false);
      alert('Leave application submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Error connecting to server');
    } finally {
      setLoadingLeave(false);
    }
  };

  const getFilteredLeaves = () => {
    return leaves.filter(leave =>
      ['type', 'status'].some(field =>
        leave[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredLeaves = getFilteredLeaves();

  return (
    <div className="leave-component">
      <div className="section-header">
        <h2>Leaves</h2>
        <button
          className="btn-secondary"
          onClick={() => setShowLeaveForm(!showLeaveForm)}
        >
          {showLeaveForm ? 'Cancel' : '+ Apply Leave'}
        </button>
      </div>

      {showLeaveForm && (
        <form className="form-card" onSubmit={handleApplyLeave}>
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
          <button type="submit" className="btn-primary" disabled={loadingLeave}>
            {loadingLeave ? 'Submitting...' : 'Submit Application'}
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
  );
}

export default LeaveComponent;
