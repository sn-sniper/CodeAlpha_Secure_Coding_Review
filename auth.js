const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  // Expecting token in the format: "Bearer <token>"
  const bearerToken = token.split(" ")[1] || token;

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET || "secretKey123",
    (err, decoded) => {
      if (err)
        return res.status(401).json({ error: "Failed to authenticate token" });
      req.userId = decoded.id;
      next();
    },
  );
}

module.exports = {
  verifyToken,
};
