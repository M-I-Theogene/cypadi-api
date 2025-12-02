import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true, // unique: true automatically creates an index
      sparse: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 200,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Cypadi Team",
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
blogPostSchema.index({ createdAt: -1 });
blogPostSchema.index({ published: 1, createdAt: -1 });
// Note: slug index is already created by unique: true in schema definition

// Generate slug from title before saving (always ensure slug exists and is unique)
blogPostSchema.pre("save", async function (next) {
  // Always generate slug if not provided or if title changed
  if (!this.slug || this.isModified("title")) {
    if (this.title && this.title.trim()) {
      let baseSlug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Ensure slug is unique by appending a number if duplicate exists
      let slug = baseSlug;
      let counter = 1;
      const BlogPostModel = this.constructor;

      // Check if slug already exists (excluding current document if updating)
      while (true) {
        const existingPost = await BlogPostModel.findOne({
          slug: slug,
          _id: { $ne: this._id }, // Exclude current document when updating
        });

        if (!existingPost) {
          // Slug is unique, use it
          this.slug = slug;
          break;
        }

        // Slug exists, append counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    } else {
      // Fallback if no title
      this.slug = `post-${Date.now()}`;
    }
  }
  next();
});

export default mongoose.model("BlogPost", blogPostSchema);

