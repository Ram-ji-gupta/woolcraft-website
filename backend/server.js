const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/db");  // ensure DB is connected

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));

// Serve uploaded images statically (Express static middleware)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => { res.send("Backend Running"); });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const settingsRoutes =
require("./routes/settingsRoutes");
app.use(
"/api/settings",
settingsRoutes
);