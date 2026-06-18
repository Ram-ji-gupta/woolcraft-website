require("dotenv").config();
const mysql = require("mysql2");

// Configure the MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME   // Ensure this environment variable is set
}, (err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;
