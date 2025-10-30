import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import courseRoutes from "./Routes/courseRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

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

// ✅ MongoDB Connection
const DB_URL =
  process.env.DB_URL ||
  "mongodb+srv://asquare:1234567ck@cluster0.we6neql.mongodb.net/Asquare";

mongoose
  .connect(DB_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Dynamic Port for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
