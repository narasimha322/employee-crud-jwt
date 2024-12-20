import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/employeeform.css';  // Import the CSS

const EditEmployee = () => {
  const { empId } = useParams();
  const [form, setForm] = useState({
    empid: '',
    name: '',
    email: '', // changed from emp_email to email
    role: '',
    date_of_joining: '',
    department: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();

  // Fetch employee details for the form
  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/dashboard/employees/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setForm(data); // Pre-fill form with the current employee data
        setLoading(false); // Set loading to false after data is fetched
      } else {
        alert('Failed to fetch employee.');
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/dashboard/employees/${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      navigate('/employees');
    } else {
      alert('Failed to update employee.');
    }
  };

  // Loading screen until data is fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="empid"
          placeholder="Employee ID"
          value={form.empid || ''}
          onChange={handleChange} ffcf
          disabled
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name || ''}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={handleChange}
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role || ''}
          onChange={handleChange}
        />
        <input
          name="date_of_joining"
          type="date"
          value={form.date_of_joining || ''}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department || ''}
          onChange={handleChange}
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number || ''}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
