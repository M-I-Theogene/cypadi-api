import express from "express";
import BlogPost from "../models/BlogPost.js";
import Comment from "../models/Comment.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all published blog posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-content"); // Don't send full content in list
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single blog post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Get all comments for this post (both top-level and replies)
    const allComments = await Comment.find({
      postId: post._id,
      approved: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    // Helper function to convert ObjectId to string
    const toIdString = (id) => {
      if (!id) return null;
      if (typeof id === "string") return id;
      if (id.toString) return id.toString();
      return String(id);
    };

    // Build nested comment tree recursively
    const buildCommentTree = (parentId = null) => {
      return allComments
        .filter((comment) => {
          const commentParentId = toIdString(comment.parentId);
          const parentIdStr = parentId ? toIdString(parentId) : null;
          return commentParentId === parentIdStr;
        })
        .map((comment) => {
          const commentId = comment._id;
          return {
            ...comment,
            replies: buildCommentTree(commentId), // Recursively get nested replies
          };
        });
    };

    // Get top-level comments (no parentId) with nested replies
    const comments = buildCommentTree(null).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Debug: Log to verify structure (remove in production)
    // console.log('Comments with replies:', JSON.stringify(comments.map(c => ({ id: c._id, repliesCount: c.replies?.length })), null, 2));

    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new blog post (admin only)
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Remove slug from body if empty - let pre-save hook generate it
    const postData = { ...req.body };
    if (!postData.slug || postData.slug.trim() === "") {
      delete postData.slug;
    }

    const post = new BlogPost(postData);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update blog post (admin only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE blog post (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Also delete associated comments
    await Comment.deleteMany({ postId: post._id });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add comment to blog post (or reply to comment)
router.post("/:slug/comments", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentData = {
      postId: post._id,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };

    // If parentId is provided, it's a reply
    if (req.body.parentId) {
      // Verify parent comment exists and belongs to this post
      const parentComment = await Comment.findOne({
        _id: req.body.parentId,
        postId: post._id,
      });
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
      commentData.parentId = req.body.parentId;
    }

    const comment = new Comment(commentData);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;



