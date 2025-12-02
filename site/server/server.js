import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
// Enable compression for all responses (reduces transfer size significantly for large content)
app.use(compression({ level: 6, threshold: 1024 })); // Compress responses > 1KB
app.use(express.json({ limit: "50mb" })); // Increased limit for rich text content
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increased limit for form data

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Cypadi Blog API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

