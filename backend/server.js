const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const searchRoutes = require("./routes/searchRoutes");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const historyRoutes = require("./routes/historyRoutes");
const exportRoutes = require("./routes/exportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const savedRoutes = require("./routes/savedRoutes");
dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/scraper", scraperRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/saved", savedRoutes);
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});