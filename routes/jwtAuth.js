const { Router } = require("express");
const pool = require("../db.js");
const bcrypt = require("bcryptjs"); // Using bcryptjs instead of bcrypt
const jwtGenerator = require("../utils/jwtGenerator.js");
const validinfo = require("../middleware/validinfo.js");
const authorization = require("../middleware/authorization.js"); // Include authorization middleware
const router = Router();

// Register Route
router.post("/register", validinfo, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists"); // Send error if email already exists
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Insert new user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, bcryptPassword]
    );

    // Generate JWT token for the newly created user
    const token = jwtGenerator(newUser.rows[0].id);

    // Send the generated token as a response
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

// Login Route
router.post("/login", validinfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Invalid Email or Password");
    }

    const token = jwtGenerator(user.rows[0].id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Token Verification Route
router.get("/is-verify", authorization, async (req, res) => {
  try {
    // If we get here, that means the token is valid
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
