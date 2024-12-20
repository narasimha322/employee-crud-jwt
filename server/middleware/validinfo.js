module.exports = function(req, res, next) {
  const { email, username, password } = req.body;

  // Helper function to validate email format
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  // Validation logic for different routes
  if (req.path === "/register") {
    // Check if required fields are present
    if (![email, username, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials"); // If any field is missing
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email"); // If the email is not in correct format
    }
  } else if (req.path === "/login") {
    // Check if login fields are present
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials"); // If any field is missing
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email"); // If the email is not in correct format
    }
  }

  next(); // Continue to the next middleware or route handler
};
