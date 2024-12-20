import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!form.email || !form.password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      // API call to login
      const response = await fetch("http://localhost:5000/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and username to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); // Save username if provided by the backend
        setError(null); // Clear any previous errors
        navigate("/employees"); // Redirect to employees page
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="login">
      <h2>Employee Details</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      
      {/* Error message if any */}
      {error && <p className="error">{error}</p>}

      {/* Register button, navigate to register page */}
      <div>
        <p>Don't have an account? </p>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
};

export default Login;
