import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("LOAD ORDERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Cập nhật trạng thái thất bại");
        return;
      }

      loadOrders();
    } catch {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const confirmCOD = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/confirm-cod`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Xác nhận COD thất bại");
        return;
      }

      loadOrders();
    } catch {
      alert("Lỗi khi xác nhận COD");
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Quản lý đơn hàng</h2>

      {orders.map((order) => {
        const codPending =
          order.paymentMethod === "cod" && order.isPaid === false;

        return (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 18,
              borderRadius: 8,
            }}
          >
            <p>
              <b>Mã đơn:</b> {order._id}
            </p>

            <p>
              <b>Khách:</b> {order.userId?.name} ({order.userId?.email})
            </p>

            
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 12,
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.product?.image}
                  alt=""
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 4,
                    background: "#f5f5f5",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div>{item.product?.name}</div>
                  <small>SL: {item.quantity}</small>
                </div>

                <b>{(item.product.price * item.quantity).toLocaleString()} ₫</b>
              </div>
            ))}

            <p style={{ marginTop: 8 }}>
              <b>Tổng:</b> {order.totalAmount.toLocaleString()} ₫
            </p>

            <p>
              <b>Thanh toán:</b> {order.paymentMethod.toUpperCase()}{" "}
              {order.isPaid ? "✅" : "⏳"}
            </p>

            
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <select
                value={order.status}
                disabled={codPending}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {codPending && (
                <button
                  style={{
                    background: "#2e7d32",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onClick={() => confirmCOD(order._id)}
                >
                  ✔ Xác nhận COD
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOrders;
