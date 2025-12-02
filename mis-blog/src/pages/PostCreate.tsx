import React, { useState, useRef } from "react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { CloudinaryUpload } from "../components/CloudinaryUpload";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import { ButtonSpinner } from "../components/ButtonSpinner";
import "react-toastify/dist/ReactToastify.css";
import "./PostForm.css";

export const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featuredImage: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    const content = editorRef.current?.getContent() || "";
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    // Show confirmation modal
    setShowModal(true);
  };

  const handleConfirm = async (publish: boolean) => {
    setShowModal(false);
    setLoading(true);
    setError("");

    try {
      const content = editorRef.current?.getContent() || "";

      await api.post("/blog", {
        title: formData.title,
        content: content,
        featuredImage: formData.featuredImage,
        author: "Cypadi Team",
        published: publish,
        tags: [],
      });

      toast.success(
        publish
          ? "Post published successfully! 🎉"
          : "Post saved as draft successfully! ✨",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Navigate after a short delay to show toast
      setTimeout(() => {
        navigate("/posts");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create post";
      setError(errorMessage);
      toast.error(`Failed to create post: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="post-form">
        <h1 className="post-form-title">Create New Post</h1>
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
              placeholder="Enter blog post title..."
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
              onInit={(evt, editor) => (editorRef.current = editor)}
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

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <ButtonSpinner /> : "Create Post"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </Layout>
  );
};


