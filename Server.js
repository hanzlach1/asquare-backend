import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import courseRoutes from "./Routes/courseRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

// Load .env variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
  })
);

// Ensure 'uploads' folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("'uploads' folder created automatically");
}

// Serve static images
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/user", userRoutes);

// Simple test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// MongoDB Connection
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("❌ DB_URL is missing in environment variables!");
  process.exit(1); // stop server if DB_URL missing
}

// Dynamic Port
const PORT = process.env.PORT || 5000;

// Connect MongoDB then start server
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // stop server if DB connection fails
  });
