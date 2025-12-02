import React, { useState } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

interface CloudinaryUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  currentImage?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadSuccess,
  currentImage,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "cypadi_blog"
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name"
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadSuccess(data.secure_url);
      toast.success("Image uploaded successfully! ✅");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        "Failed to upload image. Please check your Cloudinary settings."
      );
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="cloudinary-upload">
      {preview ? (
        <div className="cloudinary-upload-preview">
          <img src={preview} alt="Preview" />
          <button
            type="button"
            onClick={handleRemove}
            className="cloudinary-upload-remove"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <label className="cloudinary-upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: "none" }}
          />
          <div className="cloudinary-upload-placeholder">
            {uploading ? (
              <>
                <div className="upload-spinner"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FiImage size={48} />
                <span>Click to upload image</span>
                <small>Max size: 10MB</small>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  );
};



