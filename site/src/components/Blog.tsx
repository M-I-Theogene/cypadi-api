import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  views: number;
  tags?: string[];
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/blog`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="section blog" id="blog" data-aos="fade-up">
      <div className="blog__bg" aria-hidden="true" />

      <motion.div
        className="container"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div
          className="text-center mb-16"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <SectionHeading title="Updates" />
          <motion.p
            className="muted max-w-3xl mx-auto text-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Stay updated with the latest insights, news, and stories from
            Cypadi.
          </motion.p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15]"></div>
            <p className="mt-4 text-white/70">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 px-6 py-2 bg-[#facc15] text-black rounded-full hover:shadow-lg transition-shadow"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">
              No updates yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="blog__grid">
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                className="blog__card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link to={`/blog/${post.slug}`} className="blog__card-link">
                  {post.featuredImage && (
                    <div className="blog__card-image">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                      />
                      <div className="blog__card-overlay" />
                    </div>
                  )}
                  <div className="blog__card-content">
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog__card-tags">
                        {post.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="blog__card-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="blog__card-title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="blog__card-excerpt">{post.excerpt}</p>
                    )}
                    <div className="blog__card-meta">
                      <span className="blog__card-meta-item">
                        <FiCalendar size={14} />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="blog__card-meta-item">
                        {post.views} views
                      </span>
                    </div>
                    <div className="blog__card-read-more">
                      Read More <FiArrowRight />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

