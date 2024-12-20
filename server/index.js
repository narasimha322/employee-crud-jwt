const express = require("express");
const cors = require("cors");
const pool = require("./db.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register and login routes
app.use("/authentication", require("./routes/jwtAuth.js"));
app.use("/dashboard", require("./routes/dashboard.js"));

// Start the server
app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
