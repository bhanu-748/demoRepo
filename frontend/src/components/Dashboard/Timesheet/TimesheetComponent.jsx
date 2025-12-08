import React, { useState, useEffect } from 'react';
import './TimesheetComponent.css';

function TimesheetComponent({ user, searchQuery }) {
  const [timesheets, setTimesheets] = useState([
    { id: 1, date: '2025-12-07', hoursWorked: 8.5, project: 'Project Alpha', status: 'Submitted', description: 'Development work' },
    { id: 2, date: '2025-12-06', hoursWorked: 9, project: 'Project Beta', status: 'Approved', description: 'Testing' },
    { id: 3, date: '2025-12-05', hoursWorked: 7.5, project: 'Project Alpha', status: 'Approved', description: 'Meetings and planning' },
  ]);

  const [submitTimesheetForm, setSubmitTimesheetForm] = useState({
    date: '',
    project: '',
    hoursWorked: '',
    description: '',
  });

  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [loadingTimesheet, setLoadingTimesheet] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserTimesheets(user.id);
    }
  }, [user]);

  const fetchUserTimesheets = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/timesheets/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const transformedTimesheets = data.map(timesheet => ({
          id: timesheet.id,
          date: new Date(timesheet.date).toISOString().split('T')[0],
          hoursWorked: timesheet.hours_worked,
          project: timesheet.project,
          status: timesheet.status,
          description: timesheet.description,
        }));
        setTimesheets(transformedTimesheets);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleSubmitTimesheet = async (e) => {
    e.preventDefault();
    if (!submitTimesheetForm.date || !submitTimesheetForm.project || !submitTimesheetForm.hoursWorked) {
      alert('Please fill all required fields');
      return;
    }

    const hours = parseFloat(submitTimesheetForm.hoursWorked);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      alert('Please enter valid hours (0-24)');
      return;
    }

    setLoadingTimesheet(true);

    try {
      const response = await fetch('http://localhost:5000/api/timesheets/submit', {
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

  const getFilteredTimesheets = () => {
    return timesheets.filter(sheet =>
      ['project', 'status'].some(field =>
        sheet[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredTimesheets = getFilteredTimesheets();

  return (
    <div className="timesheet-component">
      <div className="section-header">
        <h2>Timesheets</h2>
        <button
          className="btn-secondary"
          onClick={() => setShowTimesheetForm(!showTimesheetForm)}
        >
          {showTimesheetForm ? 'Cancel' : '+ Submit Timesheet'}
        </button>
      </div>

      {showTimesheetForm && (
        <form className="form-card" onSubmit={handleSubmitTimesheet}>
          <div className="form-group">
            <label>Date <span className="required">*</span></label>
            <input
              type="date"
              value={submitTimesheetForm.date}
              onChange={(e) => setSubmitTimesheetForm({ ...submitTimesheetForm, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Project <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Enter project name"
              value={submitTimesheetForm.project}
              onChange={(e) => setSubmitTimesheetForm({ ...submitTimesheetForm, project: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hours Worked <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="Enter hours (0-24)"
                value={submitTimesheetForm.hoursWorked}
                onChange={(e) => setSubmitTimesheetForm({ ...submitTimesheetForm, hoursWorked: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description/Notes</label>
            <textarea
              placeholder="Add any notes or description about your work"
              value={submitTimesheetForm.description}
              onChange={(e) => setSubmitTimesheetForm({ ...submitTimesheetForm, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loadingTimesheet}>
            {loadingTimesheet ? 'Submitting...' : 'Submit Timesheet'}
          </button>
        </form>
      )}

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
  );
}

export default TimesheetComponent;
