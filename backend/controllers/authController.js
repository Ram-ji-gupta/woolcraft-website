const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const path = require("path");
const { body, validationResult } = require("express-validator");

// Validation rules for login
exports.loginValidationRules = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required")
];

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    let settings;

    // Try MySQL first
    try {
      const [mysqlSettings] = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
          if (err) {
            console.error("Database error during login, falling back to JSON:", err);
            return reject(err);
          }
          resolve(result);
        });
      });
      settings = mysqlSettings;
    } catch (dbErr) {
      // Fallback to db.json if MySQL fails
      try {
        const fallbackPath = path.join(__dirname, "../db.json");
        const fallback = require(fallbackPath);
        settings = fallback.settings;
      } catch (jsonErr) {
        console.error("Fallback JSON failed:", jsonErr);
        return res.status(500).json({ message: "Settings not configured" });
      }
    }

    if (!settings) {
      return res.status(500).json({ message: "Settings not configured" });
    }

    const usernameOk = username === settings.admin_username;
    if (!usernameOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Backward compatible: if password field is already a hash, compare it.
    const stored = settings.admin_password || "";
    const passwordOk =
      stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")
        ? await bcrypt.compare(password, stored)
        : password === stored;

    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { admin: true, sub: settings.id || 1, username: settings.admin_username },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

