const userRoutes = require("./src/routes/userRoutes");
require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db"); // 👈 import DB

const app = express();
const cors = require("cors");
app.use(cors());  


app.use(express.json());

const tripRoutes = require("./src/routes/tripRoutes");
app.use("/api/trips", tripRoutes);

const expenseRoutes = require("./src/routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

const friendRoutes = require("./src/routes/friendRoutes");
app.use("/api/friends", friendRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const PORT = process.env.PORT || 5000;

// 🔥 CONNECT DATABASE & START SERVER
(async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect:", err);
    process.exit(1);
  }
})();

