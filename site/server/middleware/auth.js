import jwt from "jsonwebtoken";

// JWT authentication middleware for admin-protected routes
export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Attach decoded payload to request for downstream handlers
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Authentication failed" });
  }
}


