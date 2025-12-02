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

// Connect to MongoDB (non-blocking - won't crash app if connection fails)
connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error.message);
  // Don't exit - let the app continue so health check can still respond
});

// Middleware - CORS configuration for production and development
app.use(
  cors({
    origin: [
      "https://cypadi.com",
      "https://www.cypadi.com",
      "https://blog.cypadi.com",
      "http://localhost:5173", // Local development - main site
      "http://localhost:3001", // Local development - admin panel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Enable compression for all responses (reduces transfer size significantly for large content)
app.use(compression({ level: 6, threshold: 1024 })); // Compress responses > 1KB
app.use(express.json({ limit: "50mb" })); // Increased limit for rich text content
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increased limit for form data

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Root route for quick testing
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Cypadi Blog API is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Cypadi Blog API is running" });
});

// Bind to 0.0.0.0 to accept connections from Render
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
