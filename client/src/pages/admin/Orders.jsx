import { useEffect, useState, useContext } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { AuthContext } from "../../context/AuthContext";

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await getAllOrders(token);
    if (res.orders) setOrders(res.orders);
  };

  const handleUpdateStatus = async (id, status) => {
    await updateOrderStatus(id, status, token);
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Quản lý đơn hàng</h2>

      {orders.map((o) => (
        <div
          key={o._id}
          style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}
        >
          <p>Khách hàng: {o.userId?.email}</p>
          <p>Tổng tiền: {o.totalAmount.toLocaleString()} ₫</p>
          <p>Trạng thái: {o.status}</p>

          <select
            value={o.status}
            onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
          >
            <option value="pending">pending</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
