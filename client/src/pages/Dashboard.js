import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          {/* Font Awesome Icon with the text */}
          <i className="fa-solid fa-user-group"></i> 
          <h2>Employee Hub</h2>
        </div>
        <ul>
          <li><button onClick={() => navigate('/register')}>Register</button></li>
          <li><button onClick={() => navigate('/login')}>Login</button></li>
        </ul>
      </nav>

      {/* Body Section */}
      <div className="body-content">
        <h1>Welcome to the Employees Web Page</h1>
        <p>This is a platform where you can manage employee details. You can register new employees, view their details, and update or delete records as needed.</p>
        
        <div className="action-section">
          <p>If you want to add your employee details, please register or login.</p>
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
