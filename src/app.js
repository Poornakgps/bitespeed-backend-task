require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./models");
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Identity Reconciliation Service is running!");
});

app.use('/api', contactRoutes);

// Error Handler
app.use(errorHandler);

// Database connection and sync
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    return db.sequelize.sync();
  })
  .then(() => {
    console.log("✅ Database synced");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

module.exports = app;