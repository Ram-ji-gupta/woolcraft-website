const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readDB } = require("../config/db-helper");
const { body, validationResult } = require("express-validator");

// Validation rules for login
exports.loginValidationRules = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required")
];

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const data = readDB();
    const settings = data.settings;

    const usernameOk = username === settings.admin_username;
    if (!usernameOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const stored = settings.admin_password || "";
    const passwordOk = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")
      ? await bcrypt.compare(password, stored)
      : password === stored;

    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not set");
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
