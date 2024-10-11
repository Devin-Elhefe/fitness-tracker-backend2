const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
// Checking is authheaders are provided!
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided." });
  }

  const token = authHeader.split(" ")[1];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign decoded payload to req.user
    req.user = decoded;
    // Call next() to invoke the next middleware function
    next();
  } catch (error) {
    // If any errors, send back a 401 status and an error message
    return res.status(401).json({ error: "Invalid authorization token." });
  }
}

module.exports = verifyToken;
