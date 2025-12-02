import express from "express";
import Admin from "../models/Admin.js";
import BlogPost from "../models/BlogPost.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// POST admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all posts (admin - includes unpublished)
router.get("/posts", authenticateToken, async (req, res) => {
  try {
    // Exclude content field for list views to improve performance
    const posts = await BlogPost.find()
      .select("-content")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster queries (returns plain JS objects)
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single post by ID (admin - includes full content for editing)
// IMPORTANT: This route must come BEFORE /posts to avoid route conflicts
router.get("/posts/:id", authenticateToken, async (req, res) => {
  try {
    // Use lean() for faster queries - returns plain JS object
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET dashboard stats (optimized - uses aggregation)
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const [postsStats, commentsCount] = await Promise.all([
      // Get posts count and total views without fetching content
      BlogPost.aggregate([
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: "$views" },
          },
        },
      ]),
      // Get comments count
      Comment.countDocuments(),
    ]);

    res.json({
      totalPosts: postsStats[0]?.totalPosts || 0,
      totalComments: commentsCount,
      totalViews: postsStats[0]?.totalViews || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all comments (admin)
router.get("/comments", authenticateToken, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster queries
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT approve/delete comment (admin)
router.put("/comments/:id", authenticateToken, async (req, res) => {
  try {
    const { approved } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE comment (admin)
router.delete("/comments/:id", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET current admin profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update admin profile (username and/or password)
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Current password is required to change password" });
      }
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      admin.password = newPassword;
    }

    // Update username if provided
    if (username && username !== admin.username) {
      // Check if new username already exists
      const existingAdmin = await Admin.findOne({ username });
      if (
        existingAdmin &&
        existingAdmin._id.toString() !== admin._id.toString()
      ) {
        return res.status(400).json({ error: "Username already exists" });
      }
      admin.username = username;
    }

    await admin.save();

    // Return updated admin without password
    const updatedAdmin = await Admin.findById(admin._id).select("-password");
    res.json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;



