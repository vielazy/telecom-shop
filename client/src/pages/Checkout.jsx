import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await createOrder(token);
    setLoading(false);

    if (res.order) {
      clearCart();
      navigate("/my-orders");
    } else {
      alert(res.message || "Không thể tạo đơn hàng");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Xác nhận đơn hàng</h2>

      <p>Số sản phẩm: {cart.items.length}</p>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
};

export default Checkout;
