import React from "react";
import "./ConfirmationModal.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: (publish: boolean) => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2 className="confirm-modal-title">Publish Post</h2>
        <p className="confirm-modal-message">
          Do you want to publish this post now or save it as a draft?
        </p>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn secondary"
            onClick={() => onConfirm(false)}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="confirm-modal-btn primary"
            onClick={() => onConfirm(true)}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};



