import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registerform.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null); // To display error messages
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      // API call to register
      const response = await fetch(
        "http://localhost:5000/authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setError(null); // Clear any previous errors
        navigate("/login"); // Navigate to the login page after successful registration
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="register">
      <h2> Employee Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* Login button to navigate to the login page */}
      <div>
        <p>Already have an account? </p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default Register;
