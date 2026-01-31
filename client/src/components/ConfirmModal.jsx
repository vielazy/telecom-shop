import "./ConfirmModal.css";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Huỷ
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
