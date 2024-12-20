const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db");  // Ensure the database connection is imported here

module.exports = async (req, res, next) => {
  try {
    // Log the Authorization header to check if it's present
    console.log("Authorization Header:", req.header("Authorization"));

    // Extract the token from the Authorization header (Bearer <token>)
    const jwtToken = req.header("Authorization")?.split(" ")[1];

    if (!jwtToken) {
      return res.status(403).json("No token provided");
    }

    // Log the received token for debugging
    console.log("Received Token:", jwtToken);

    // Verify JWT and decode the payload
    const payload = jwt.verify(jwtToken, process.env.jwtsecret);

    // Log the decoded payload
    console.log("Decoded Payload:", payload);
    console.log("User from payload:", payload.user);

    // Check if the user exists in the database
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [payload.user]);
    console.log("Database query result:", user.rows);

    // If the user does not exist in the database
    if (user.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    // Set the user object in the request
    req.user = user.rows[0]; // Store the user data in the request object

    next(); // Proceed to the next route handler
  } catch (error) {
    console.error("Error during JWT verification:", error.message);
    return res.status(403).json("Not Authorized");
  }
};
