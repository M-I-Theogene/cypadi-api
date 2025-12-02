import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiSend,
  FiEye,
  FiClock,
  FiCornerDownRight,
  FiX,
} from "react-icons/fi";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import "./BlogPost.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  views: number;
  tags?: string[];
}

interface Comment {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  parentId?: string | null;
  replies?: Comment[];
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [replyForms, setReplyForms] = useState<{
    [key: string]: { name: string; email: string; message: string };
  }>({});

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/blog/${slug}`);
      if (!response.ok) throw new Error("Post not found");
      const data = await response.json();
      setPost(data.post);
      // Ensure we only show top-level comments (filter out any that might have parentId)
      // Replies should be nested in the replies array
      const topLevelComments = (data.comments || []).filter(
        (comment: Comment) => !comment.parentId
      );
      setComments(topLevelComments);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load update");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/blog/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentForm),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      const newComment = await response.json();

      if (replyingTo) {
        // Update the comment with the new reply
        setComments(
          comments.map((comment) => {
            if (comment._id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          })
        );
        // Clear reply form
        setReplyForms((prev) => {
          const updated = { ...prev };
          delete updated[replyingTo];
          return updated;
        });
        setReplyingTo(null);
      } else {
        setComments([newComment, ...comments]);
        setCommentForm({ name: "", email: "", message: "" });
      }
      toast.success(
        replyingTo
          ? "Reply submitted successfully!"
          : "Comment submitted successfully!"
      );
    } catch (err) {
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${diffInSeconds === 1 ? "sec" : "secs"} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "min"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}${diffInHours === 1 ? "h" : "h"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  };

  const formatPublishedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (!replyForms[commentId]) {
      setReplyForms((prev) => ({
        ...prev,
        [commentId]: { name: "", email: "", message: "" },
      }));
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!slug) return;

    const replyForm = replyForms[parentId];
    if (!replyForm) return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/blog/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...replyForm,
          parentId: parentId,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit reply");

      const newReply = await response.json();
      setComments(
        comments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          return comment;
        })
      );
      setReplyForms((prev) => {
        const updated = { ...prev };
        delete updated[parentId];
        return updated;
      });
      setReplyingTo(null);
      toast.success("Reply submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCommentsCount = () => {
    return comments.reduce(
      (total, comment) => total + 1 + (comment.replies?.length || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="blog-post-page blog-post-page--loading">
        <div className="blog-post-loading">
          <ScaleLoader
            color="#facc15"
            height={35}
            width={4}
            radius={2}
            margin={2}
          />
          <p className="blog-post-loading-text">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-page blog-post-page--error">
        <div className="blog-post-error">
          <div className="blog-post-error__icon">⚠️</div>
          <h2 className="blog-post-error__title">Post Not Found</h2>
          <p className="blog-post-error__message">
            {error || "The update you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/#blog")}
            className="blog-post-error__button"
          >
            <FiArrowLeft /> Back to Updates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Background Effects */}
      <div className="blog-post-background">
        <div className="blog-post-background__gradient"></div>
        <div className="blog-post-background__particles"></div>
      </div>

      <div className="blog-post-container">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/#blog")}
          className="blog-post-back-button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft /> Back to Updates
        </motion.button>

        <article className="blog-post-article">
          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div
              className="blog-post-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="blog-post-image">
                <img src={post.featuredImage} alt={post.title} />
                <div className="blog-post-image__overlay"></div>
              </div>
            </motion.div>
          )}

          {/* Header Section */}
          <motion.header
            className="blog-post-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="blog-post-tags">
                {post.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    className="blog-post-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="blog-post-title">{post.title}</h1>

            {/* Meta Information */}
            <div className="blog-post-meta">
              <div className="blog-post-meta__item">
                <FiUser className="blog-post-meta__icon" />
                <span>{post.author}</span>
              </div>
              <div className="blog-post-meta__item">
                <FiCalendar className="blog-post-meta__icon" />
                <span>{formatPublishedDate(post.createdAt)}</span>
              </div>
              <div className="blog-post-meta__item">
                <FiClock className="blog-post-meta__icon" />
                <span>{formatRelativeTime(post.createdAt)}</span>
              </div>
              <div className="blog-post-meta__item">
                <FiEye className="blog-post-meta__icon" />
                <span>{post.views} views</span>
              </div>
            </div>
          </motion.header>

          {/* Content Section */}
          <motion.div
            className="blog-post-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div
              className="blog-post-content__html"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Divider */}
          <div className="blog-post-divider">
            <div className="blog-post-divider__line"></div>
            <div className="blog-post-divider__icon">✨</div>
            <div className="blog-post-divider__line"></div>
          </div>

          {/* Comments Section */}
          <motion.section
            className="blog-post-comments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="blog-post-comments__header">
              <h2 className="blog-post-comments__title">
                Comments ({totalCommentsCount()})
              </h2>
              <div className="blog-post-comments__underline"></div>
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="blog-post-comment-form"
            >
              <div className="blog-post-comment-form__row">
                <div className="blog-post-comment-form__group">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={commentForm.name}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, name: e.target.value })
                    }
                    className="blog-post-comment-form__input"
                  />
                </div>
                <div className="blog-post-comment-form__group">
                  <input
                    type="email"
                    placeholder="Your Email *"
                    required
                    value={commentForm.email}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, email: e.target.value })
                    }
                    className="blog-post-comment-form__input"
                  />
                </div>
              </div>
              <div className="blog-post-comment-form__group">
                <textarea
                  placeholder="Your Comment *"
                  required
                  rows={5}
                  value={commentForm.message}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, message: e.target.value })
                  }
                  className="blog-post-comment-form__textarea"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="blog-post-comment-form__submit"
              >
                {submitting ? (
                  <ScaleLoader
                    color="#000000"
                    height={20}
                    width={3}
                    radius={2}
                    margin={1}
                  />
                ) : (
                  <>
                    <span>Submit Comment</span>
                    <FiSend />
                  </>
                )}
              </button>
            </form>

            {/* Comments List */}
            <div className="blog-post-comments-list">
              {comments.length === 0 ? (
                <div className="blog-post-comments-empty">
                  <div className="blog-post-comments-empty__icon">💬</div>
                  <p className="blog-post-comments-empty__text">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    index={index}
                    replyingTo={replyingTo}
                    replyForm={replyForms[comment._id]}
                    onReplyClick={handleReplyClick}
                    onSubmitReply={handleSubmitReply}
                    replyForms={replyForms}
                    expandedReplies={expandedReplies}
                    onReplyFormChange={(commentId, field, value) => {
                      setReplyForms({
                        ...replyForms,
                        [commentId]: {
                          ...(replyForms[commentId] || {
                            name: "",
                            email: "",
                            message: "",
                          }),
                          [field]: value,
                        },
                      });
                    }}
                    onToggleReplies={(commentId) => {
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [commentId]: !prev[commentId],
                      }));
                    }}
                    formatRelativeTime={formatRelativeTime}
                    submitting={submitting}
                  />
                ))
              )}
            </div>
          </motion.section>
        </article>
      </div>
    </div>
  );
};

// Comment Item Component with Reply Functionality
interface CommentItemProps {
  comment: Comment;
  index: number;
  replyingTo: string | null;
  replyForm?: { name: string; email: string; message: string };
  replyForms?: {
    [key: string]: { name: string; email: string; message: string };
  };
  expandedReplies?: { [key: string]: boolean };
  onReplyClick: (commentId: string) => void;
  onSubmitReply: (e: React.FormEvent, parentId: string) => void;
  onReplyFormChange: (commentId: string, field: string, value: string) => void;
  onToggleReplies?: (commentId: string) => void;
  formatRelativeTime: (date: string) => string;
  submitting: boolean;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  index,
  replyingTo,
  replyForm,
  replyForms = {},
  expandedReplies = {},
  onReplyClick,
  onSubmitReply,
  onReplyFormChange,
  onToggleReplies,
  formatRelativeTime,
  submitting,
  isReply = false,
}) => {
  const currentReplyForm = replyForm || replyForms[comment._id];
  return (
    <motion.div
      className={`blog-post-comment ${
        isReply ? "blog-post-comment--reply" : ""
      }`}
      initial={{ opacity: 0, x: isReply ? -20 : 0, y: isReply ? 0 : 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="blog-post-comment__wrapper">
        <div className="blog-post-comment__avatar">
          <div
            className={`blog-post-comment__avatar-inner ${
              isReply ? "blog-post-comment__avatar-inner--reply" : ""
            }`}
          >
            {comment.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="blog-post-comment__content">
          <div className="blog-post-comment__header">
            <div className="blog-post-comment__info">
              <h4 className="blog-post-comment__name">{comment.name}</h4>
              <div className="blog-post-comment__meta">
                <span className="blog-post-comment__date">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <p className="blog-post-comment__message">{comment.message}</p>
          <button
            className="blog-post-comment__reply-btn"
            onClick={() => onReplyClick(comment._id)}
          >
            {replyingTo === comment._id ? (
              <>
                <FiX /> Cancel
              </>
            ) : (
              <>
                <FiCornerDownRight /> Reply
              </>
            )}
          </button>

          {/* Reply Form */}
          {replyingTo === comment._id && currentReplyForm && (
            <motion.form
              className="blog-post-comment-reply-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={(e) => onSubmitReply(e, comment._id)}
            >
              <div className="blog-post-comment-reply-form__row">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={currentReplyForm.name}
                  onChange={(e) =>
                    onReplyFormChange(comment._id, "name", e.target.value)
                  }
                  className="blog-post-comment-reply-form__input"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={currentReplyForm.email}
                  onChange={(e) =>
                    onReplyFormChange(comment._id, "email", e.target.value)
                  }
                  className="blog-post-comment-reply-form__input"
                />
              </div>
              <textarea
                placeholder="Your Reply *"
                required
                rows={3}
                value={currentReplyForm.message}
                onChange={(e) =>
                  onReplyFormChange(comment._id, "message", e.target.value)
                }
                className="blog-post-comment-reply-form__textarea"
              />
              <button
                type="submit"
                disabled={submitting}
                className="blog-post-comment-reply-form__submit"
              >
                {submitting ? (
                  <ScaleLoader
                    color="#000000"
                    height={16}
                    width={2}
                    radius={2}
                    margin={1}
                  />
                ) : (
                  <>
                    <span>Post Reply</span>
                    <FiSend />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* Replies - Collapsible with "View (n) replies" button */}
          {comment.replies && comment.replies.length > 0 && (
            <>
              <button
                className={`blog-post-comment__view-replies-btn ${
                  expandedReplies[comment._id]
                    ? "blog-post-comment__view-replies-btn--expanded"
                    : ""
                }`}
                onClick={() => {
                  if (onToggleReplies) {
                    onToggleReplies(comment._id);
                  }
                }}
              >
                <FiCornerDownRight />
                {expandedReplies[comment._id]
                  ? `Hide ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </button>
              {expandedReplies[comment._id] && (
                <div className="blog-post-comment__replies">
                  {comment.replies.map((reply, replyIndex) => (
                    <CommentItem
                      key={reply._id}
                      comment={reply}
                      index={replyIndex}
                      replyingTo={replyingTo}
                      replyForm={replyForms[reply._id]}
                      replyForms={replyForms}
                      expandedReplies={expandedReplies}
                      onReplyClick={onReplyClick}
                      onSubmitReply={onSubmitReply}
                      onReplyFormChange={onReplyFormChange}
                      onToggleReplies={onToggleReplies}
                      formatRelativeTime={formatRelativeTime}
                      submitting={submitting}
                      isReply={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};


