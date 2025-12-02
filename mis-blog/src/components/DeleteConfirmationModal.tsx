import React from "react";
import "./DeleteConfirmationModal.css";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-backdrop" onClick={onCancel}>
      <div
        className="delete-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2 className="delete-modal-title">{title}</h2>
        <p className="delete-modal-message">{message}</p>
        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-modal-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-modal-btn confirm"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};



