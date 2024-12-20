import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/employeeform.css';  // Import the CSS

const AddEmployee = () => {
  const [form, setForm] = useState({
    empid: '',
    name: '',
    emp_email: '',
    role: '',
    date_of_joining: '',
    department: '',
    phone_number: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Validate required fields
    if (!form.empid || !form.name || !form.emp_email || !form.role || !form.date_of_joining || !form.department || !form.phone_number) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Update fetch URL to correct endpoint
    const response = await fetch('http://localhost:5000/dashboard/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      navigate('/employees');
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to add employee.');
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="empid"
          placeholder="Employee ID"
          value={form.empid}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="emp_email"
          placeholder="Email"
          value={form.emp_email}
          onChange={handleChange}
          required
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />
        <input
          name="date_of_joining"
          type="date"
          value={form.date_of_joining}
          onChange={handleChange}
          required
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddEmployee;
