import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { ScaleLoader } from "react-spinners";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { toast } from "react-toastify";
import "./PostsList.css";

interface Post {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
}

export const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: string | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.get("/admin/posts");
      setPosts(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      postId: id,
      postTitle: title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.postId) return;

    try {
      await api.delete(`/blog/${deleteModal.postId}`);
      setPosts(posts.filter((p) => p._id !== deleteModal.postId));

      toast.success("Post deleted successfully! 🗑️", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete post";
      toast.error(`Failed to delete post: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="posts-loading">
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
      <div className="posts-list">
        <div className="posts-header">
          <h1 className="posts-title">Blog Posts</h1>
          <Link to="/posts/create" className="create-button">
            <FiPlus /> New Post
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Create your first post!</p>
            <Link to="/posts/create" className="create-button">
              <FiPlus /> Create Post
            </Link>
          </div>
        ) : (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className="post-title">{post.title}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          post.published ? "published" : "draft"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>{post.views || 0}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/posts/edit/${post._id}`}
                          className="action-btn edit"
                          title="Edit post"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteClick(post._id, post.title)
                          }
                          className="action-btn delete"
                          title="Delete post"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteModal({ isOpen: false, postId: null, postTitle: "" })
        }
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteModal.postTitle}"? This action cannot be undone.`}
      />
    </Layout>
  );
};



