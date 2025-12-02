import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import {
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";
import { ScaleLoader } from "react-spinners";
import "./Comments.css";

interface Comment {
  _id: string;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  createdAt: string;
  postId?: {
    title: string;
    slug: string;
  };
}

export const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pendingCount = comments.filter((c) => !c.approved).length;
  const approvedCount = comments.filter((c) => c.approved).length;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await api.get("/admin/comments");
      setComments(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await api.put(`/admin/comments/${id}`, { approved });
      setComments(comments.map((c) => (c._id === id ? { ...c, approved } : c)));
    } catch (err) {
      alert("Failed to update comment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/admin/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="comments-loading">
          <ScaleLoader
            color="#facc15"
            height={35}
            width={4}
            radius={2}
            margin={2}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="comments-page">
        <div className="comments-header">
          <div>
            <p className="eyebrow">Engagement</p>
            <h1 className="comments-title">Comments Management</h1>
            <p className="comments-subtitle">
              Moderate what readers are saying across your posts.
            </p>
          </div>
          <button className="refresh-btn" onClick={fetchComments}>
            <FiRefreshCw />
            Refresh
          </button>
        </div>
        <div className="comments-metrics">
          <div className="metric-card">
            <FiMessageCircle />
            <div>
              <p>Total</p>
              <strong>{comments.length}</strong>
            </div>
          </div>
          <div className="metric-card">
            <FiCheck />
            <div>
              <p>Approved</p>
              <strong>{approvedCount}</strong>
            </div>
          </div>
          <div className="metric-card">
            <FiClock />
            <div>
              <p>Pending</p>
              <strong>{pendingCount}</strong>
            </div>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {comments.length === 0 ? (
          <div className="empty-state">No comments yet.</div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className={`comment-card ${!comment.approved ? "pending" : ""}`}
              >
                <div className="comment-header">
                  <div>
                    <h3 className="comment-name">{comment.name}</h3>
                    <p className="comment-email">{comment.email}</p>
                    <div className="comment-meta">
                      {comment.postId && (
                        <span className="comment-post">
                          {comment.postId.title}
                        </span>
                      )}
                      <span className="comment-id">
                        #{comment._id.slice(-6)}
                      </span>
                    </div>
                  </div>
                  <div className="comment-header-meta">
                    <span
                      className={`comment-status ${
                        comment.approved ? "approved" : "pending"
                      }`}
                    >
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="comment-message">
                  <p>{comment.message}</p>
                </div>
                <div className="comment-actions">
                  {!comment.approved && (
                    <button
                      onClick={() => handleApprove(comment._id, true)}
                      className="action-btn approve"
                      aria-label="Approve comment"
                      title="Approve comment"
                    >
                      <FiCheck />
                    </button>
                  )}
                  {comment.approved && (
                    <button
                      onClick={() => handleApprove(comment._id, false)}
                      className="action-btn reject"
                      aria-label="Unapprove comment"
                      title="Unapprove comment"
                    >
                      <FiX />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="action-btn delete"
                    aria-label="Delete comment"
                    title="Delete comment"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
