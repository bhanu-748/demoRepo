// src/components/Dashboard/Profile/ProfileComponent.jsx
import React, { useEffect, useState } from 'react';
import './ProfileComponent.css';

const API_BASE_URL = '/api/profile';


function ProfileComponent({ user }) {
  const [form, setForm] = useState({
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load existing profile
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      setLoading(true);
      setMessage('');
      try {
        const res = await fetch(`${API_BASE_URL}/user/${user.id}`);
        const data = await res.json();

        if (data) {
          setForm({
            phone: data.phone || '',
            date_of_birth: data.date_of_birth || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            postal_code: data.postal_code || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          postal_code: form.postal_code,
          emergency_contact_name: form.emergency_contact_name,
          emergency_contact_phone: form.emergency_contact_phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to save profile');
      } else {
        setMessage('Profile saved successfully');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage('Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-component">
      <div className="section-header">
        <h2>Employee Profile</h2>
      </div>

      <div className="profile-layout">
        {/* Left Card: Basic info from user object */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p className="profile-meta">
                Employee ID: <strong>EMP{String(user.id).padStart(5, '0')}</strong>
              </p>
            </div>
          </div>

          <div className="profile-static-details">
            <div className="detail-row">
              <label>Department</label>
              <span>Engineering</span>
            </div>
            <div className="detail-row">
              <label>Designation</label>
              <span>Software Developer</span>
            </div>
          </div>
        </div>

        {/* Right: Editable form */}
        <div className="profile-form-wrapper">
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <form className="form-card" onSubmit={handleSubmit}>
              {message && <div className="profile-message">{message}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, area, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h3 className="subsection-title">Emergency Contact</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={form.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    name="emergency_contact_phone"
                    value={form.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
