const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to generate a JWT for a user
function jwtGenerator(user_id) { 
  const payload = { user: user_id };  // Add the user ID to the payload

  return jwt.sign(payload, process.env.jwtsecret, { expiresIn: "1hr" }); // JWT expires in 1hr 
}

module.exports = jwtGenerator;
