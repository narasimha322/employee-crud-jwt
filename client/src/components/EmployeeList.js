import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/employeelist.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionText, setActionText] = useState("Add"); // Initial text
  const [textColor, setTextColor] = useState("green"); // Initial color
  const navigate = useNavigate();

  // Fetch employees from the server
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        if (Array.isArray(data) && data.length > 0) {
          setEmployees(data);
        } else {
          setEmployees([]); // Handle case where there are no employees
        }
      } else {
        setError(data.error || "Failed to fetch employees.");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an employee
  const handleDelete = async (empId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/dashboard/employees/${empId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Employee deleted successfully.");
        fetchEmployees();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete employee.");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  // Change action text dynamically every 2 seconds
  useEffect(() => {
    const actions = [
      { text: "Add", color: "green" },
      { text: "Edit", color: "orange" },
      { text: "Delete", color: "red" },
    ];
    let index = 0;

    const intervalId = setInterval(() => {
      setActionText(actions[index].text);
      setTextColor(actions[index].color);
      index = (index + 1) % actions.length;
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="employee-list">
      <h2 style={{ color: textColor }}>
        Hey, you can {actionText.toLowerCase()} employee details now!
      </h2>

      {/* Buttons Container */}
      <div className="button-container">
        <button
          className="btn btn-success"
          onClick={() => navigate("/add-employee")}
        >
          Add Employee
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : employees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>EmpID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date of Joining</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.empid}>
                <td>{emp.empid}</td>
                <td>{emp.name}</td>
                <td>{emp.emp_email}</td>
                <td>{emp.role}</td>
                <td>{emp.date_of_joining}</td>
                <td>{emp.department}</td>
                <td>{emp.phone_number}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/edit-employee/${emp.empid}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(emp.empid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found. You can add employees using the button above!</p>
      )}
    </div>
  );
};

export default EmployeeList;
