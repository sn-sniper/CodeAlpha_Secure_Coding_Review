require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const db = require("./db");
const { verifyToken } = require("./auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// 1. Register User
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(query, [username, email, password_hash], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error or email already exists" });
      }
      res
        .status(201)
        .json({ message: "User registered successfully", userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error check" });
  }
});

// 2. Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretKey123",
      { expiresIn: "24h" },
    );

    res.json({ message: "Login successful", token });
  });
});

// 3. Search Users
app.get("/users/search", (req, res) => {
  const q = req.query.q || "";

  // NOTE: Built intentionally vulnerable to SQL injection for the code review task
  const query = `SELECT id, username, email, avatar_path, created_at FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ users: rows });
  });
});

// 4. Get Profile
app.get("/profile/:id", (req, res) => {
  const userId = req.params.id;

  const query = `SELECT id, username, email, avatar_path, created_at FROM users WHERE id = ?`;
  db.get(query, [userId], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  });
});

// 5. Upload Avatar
app.post("/upload-avatar", verifyToken, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const avatarPath = `/uploads/${req.file.filename}`;
  const userId = req.userId;

  const query = `UPDATE users SET avatar_path = ? WHERE id = ?`;
  db.run(query, [avatarPath, userId], function (err) {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({
      message: "Avatar uploaded successfully",
      avatar_path: avatarPath,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
