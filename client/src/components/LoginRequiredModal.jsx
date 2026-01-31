import { useNavigate } from "react-router-dom";
import "./LoginRequiredModal.css";

const LoginRequiredModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>⚠️ Chưa đăng nhập</h3>
        <p>Bạn cần đăng nhập lại để xem đơn hàng.</p>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Đóng
          </button>

          <button className="btn-primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
