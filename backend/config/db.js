require("dotenv").config();
const mysql = require("mysql2");

// Configure the MySQL connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Helpful startup validation (prevents opaque “Access denied for user ''”) 
const missing = Object.entries(dbConfig)
  .filter(([, v]) => v === undefined || v === null || String(v).trim() === '')
  .map(([k]) => k);

if (missing.length) {
  console.error(
    `MySQL config missing env vars: ${missing.join(", ")}. ` +
    `Check backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).`
  );
}

const db = mysql.createConnection(dbConfig, (err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;
