import React, { useState, useEffect, useRef } from "react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { CloudinaryUpload } from "../components/CloudinaryUpload";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { ButtonSpinner } from "../components/ButtonSpinner";
import "./PostForm.css";

export const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featuredImage: "",
    published: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      // Fetch single post with full content for editing
      const post = await api.get(`/admin/posts/${id}`);
      if (post) {
        setFormData({
          title: post.title || "",
          content: post.content || "",
          featuredImage: post.featuredImage || "",
          published: post.published !== false,
        });
        // Set editor content after a brief delay to ensure editor is initialized
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.setContent(post.content || "");
          }
        }, 500);
      } else {
        setError("Post not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      const content = editorRef.current?.getContent() || "";

      await api.put(`/blog/${id}`, {
        title: formData.title,
        content: content,
        featuredImage: formData.featuredImage,
        author: "Cypadi Team",
        published: formData.published,
        tags: [],
      });

      toast.success("Post updated successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/posts");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update post";
      setError(errorMessage);
      toast.error(`Failed to update post: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="post-form-loading">
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
      <div className="post-form">
        <h1 className="post-form-title">Edit Post</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | image | code",
                content_style:
                  "body { font-family: 'Poppins', Arial, sans-serif; font-size: 16px; color: #ffffff; background: #0a0a0a; }",
                skin: "oxide-dark",
                content_css: "dark",
                branding: false,
                // Configure image upload to Cloudinary (prevents base64 embedding)
                images_upload_handler: async (blobInfo, progress) => {
                  return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append(
                      "file",
                      blobInfo.blob(),
                      blobInfo.filename()
                    );
                    formData.append(
                      "upload_preset",
                      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
                        "cypadi_blog"
                    );

                    const xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open(
                      "POST",
                      `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
                        "your-cloud-name"
                      }/image/upload`
                    );

                    xhr.upload.onprogress = (e) => {
                      progress((e.loaded / e.total) * 100);
                    };

                    xhr.onload = () => {
                      if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.secure_url);
                      } else {
                        reject("Image upload failed");
                      }
                    };

                    xhr.onerror = () => {
                      reject("Image upload failed");
                    };

                    xhr.send(formData);
                  });
                },
                // Prevent automatic image conversion to base64
                automatic_uploads: true,
                paste_data_images: false,
              }}
            />
          </div>

          <div className="form-group">
            <label>Featured Image</label>
            <CloudinaryUpload
              onUploadSuccess={(imageUrl) =>
                setFormData({ ...formData, featuredImage: imageUrl })
              }
              currentImage={formData.featuredImage}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <ButtonSpinner /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};


