const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorization");
const pool = require("../db");

// Get User and Employee Details (GET route)
router.get("/", authorize, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json("User not authenticated");
    }

    // Fetch employee and user details, considering multiple employees
    const user = await pool.query(
      `SELECT e.empid, e.name, e.email AS emp_email, e.role, e.date_of_joining, e.department, e.phone_number, 
              u.id, u.username, u.email, u.password
       FROM employees e
       LEFT JOIN users u ON e.id = u.id
       WHERE e.id = $1`,
      [req.user.id] // Fetch based on the logged-in user's ID
    );

    if (user.rows.length === 0) {
      // If no employees found, fetch only user details
      const userData = await pool.query(
        `SELECT u.id, u.username, u.email, u.password
         FROM users u
         WHERE u.id = $1`,
        [req.user.id]
      );

      if (userData.rows.length === 0) {
        return res.status(404).json("No user data found");
      }

      return res.json(userData.rows[0]); // Only return user data if no employees found
    }

    res.json(user.rows); // Send back all employees associated with the user
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get Employee by empId (GET route)
router.get("/employees/:empId", authorize, async (req, res) => {
  const { empId } = req.params;

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json("User not authenticated");
    }

    // Query the database to get the employee by empId
    const result = await pool.query(
      `SELECT * FROM employees WHERE empid = $1 AND id = $2`,
      [empId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("Employee not found or Unauthorized access");
    }

    // Return the employee details
    res.json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add Employee (POST route)
router.post("/employees", authorize, async (req, res) => {
  const { empid, name, emp_email, role, date_of_joining, department, phone_number } = req.body;

  // Log the received data to check if email is being passed correctly
  console.log("Received data:", req.body);

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json("User not authenticated");
    }

    // Optional: Check if empId already exists in the employees table
    const existingEmployee = await pool.query(
      "SELECT * FROM employees WHERE empid = $1",
      [empid]
    );
    if (existingEmployee.rows.length > 0) {
      return res.status(400).json("Employee with this empId already exists");
    }

    // Insert new employee into the employees table
    const result = await pool.query(
      `INSERT INTO employees (empid, id, name, email, role, date_of_joining, department, phone_number)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        empid, req.user.id, name, emp_email, role, date_of_joining, department, phone_number
      ]
    );

    res.json(result.rows[0]); // Return the created employee record
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/employees/:empId", authorize, async (req, res) => {
  const { empId } = req.params;
  const { name, email, role, date_of_joining, department, phone_number } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !role || !date_of_joining || !department || !phone_number) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    // Check if the employee exists and if the user has permission to update it
    const result = await pool.query(
      `SELECT * FROM employees WHERE empid = $1 AND id = $2`,
      [empId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found or Unauthorized access" });
    }

    // Proceed with the update if the employee exists and the user is authorized
    const updatedEmployee = await pool.query(
      `UPDATE employees 
       SET name = $1, email = $2, role = $3, date_of_joining = $4, department = $5, phone_number = $6
       WHERE empid = $7 AND id = $8 RETURNING *`,
      [name, email, role, date_of_joining, department, phone_number, empId, req.user.id]
    );

    if (updatedEmployee.rows.length === 0) {
      return res.status(400).json({ error: "Failed to update employee." });
    }

    // Returning the updated employee details
    res.json({
      employee: updatedEmployee.rows[0],
      message: "Employee updated successfully"
    });``

  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete Employee (DELETE route)
router.delete("/employees/:empId", authorize, async (req, res) => {
  const { empId } = req.params;

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json("User not authenticated");
    }

    // Check if the employee exists and if the user has permission to delete it
    const result = await pool.query(
      "DELETE FROM employees WHERE empid = $1 AND id = $2 RETURNING *",
      [empId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("Employee not found or Unauthorized access");
    }

    res.json({ message: "Employee deleted successfully" }); // Return success message
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
