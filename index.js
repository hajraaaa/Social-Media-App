// Step 01: Require Express JS
const express = require("express");

const userRoutes = require("./routes/user.routes");

// Step 02: Acquire express in app variable
const app = express();

require("dotenv").config();
// Step 03: PORT
const PORT = 4000;

require("./models/db")();

// Step 06: Middlewares
app.use(express.json());

// Step 05: Create Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);

// Step 04: Listen the express app
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
