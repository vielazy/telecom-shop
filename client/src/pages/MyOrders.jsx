import { useContext, useEffect, useState } from "react";
import { getMyOrders, cancelOrder, payOrder } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await getMyOrders(token);
    if (res.orders) setOrders(res.orders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Đơn hàng của tôi</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <p>Mã đơn: {order._id}</p>
          <p>Trạng thái: {order.status}</p>
          <p>Tổng tiền: {order.totalAmount.toLocaleString()} ₫</p>

          {order.status === "pending" && (
            <>
              <button onClick={() => payOrder(order._id, "mock", token)}>
                Thanh toán
              </button>
              <button onClick={() => cancelOrder(order._id, token)}>
                Huỷ đơn
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
