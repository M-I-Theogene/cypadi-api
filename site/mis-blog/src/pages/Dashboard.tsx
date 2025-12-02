import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { FiFileText, FiMessageSquare, FiEye, FiPlus } from "react-icons/fi";
import { ScaleLoader } from "react-spinners";
import "./Dashboard.css";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Use optimized stats endpoint instead of fetching all data
      const statsData = await api.get("/admin/stats");
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback to old method if stats endpoint fails
      try {
        const [posts, comments] = await Promise.all([
          api.get("/admin/posts"),
          api.get("/admin/comments"),
        ]);

        const totalViews = posts.reduce(
          (sum: number, post: any) => sum + (post.views || 0),
          0
        );

        setStats({
          totalPosts: posts.length,
          totalComments: comments.length,
          totalViews,
        });
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">
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
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FiFileText />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalPosts}</h3>
              <p className="stat-label">Total Posts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiMessageSquare />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalComments}</h3>
              <p className="stat-label">Total Comments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiEye />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalViews}</h3>
              <p className="stat-label">Total Views</p>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link to="/posts/create" className="action-button">
            <FiPlus /> Create New Post
          </Link>
          <Link to="/posts" className="action-button secondary">
            <FiFileText /> Manage Posts
          </Link>
          <Link to="/comments" className="action-button secondary">
            <FiMessageSquare /> Manage Comments
          </Link>
        </div>
      </div>
    </Layout>
  );
};

