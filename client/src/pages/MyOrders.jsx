import { useContext, useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginRequiredModal from "../components/LoginRequiredModal";

const MyOrders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const loadOrders = async () => {
    if (!token) return;
    const res = await getMyOrders(token);
    if (res?.orders) setOrders(res.orders);
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
    }
  }, [user]);

  if (!user) {
    return <LoginRequiredModal open={true} onClose={() => navigate("/")} />;
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Đơn hàng của tôi</h2>

      {orders.length === 0 && <p>Chưa có đơn hàng nào</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            marginBottom: 16,
            padding: 14,
            borderRadius: 6,
          }}
        >
          <p>
            <b>Mã đơn:</b> {order._id}
          </p>
          <p>
            <b>Trạng thái:</b> {order.status}
          </p>

          <div style={{ marginTop: 10 }}>
            <b>Sản phẩm:</b>

            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: 14,
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 6,
                    background: "#f5f5f5",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                  <div style={{ color: "#666" }}>Số lượng: {item.quantity}</div>
                </div>

                <div style={{ fontWeight: "bold" }}>
                  {(item.product.price * item.quantity).toLocaleString()} ₫
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 10 }}>
            <b>Tổng tiền:</b> {order.totalAmount.toLocaleString()} ₫
          </p>

          {order.status === "pending" && (
            <button
              onClick={async () => {
                await cancelOrder(order._id, token);
                loadOrders();
              }}
            >
              Huỷ đơn
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
