import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cart || cart.items.length === 0) {
    return <p style={{ padding: 20 }}>Không có sản phẩm để thanh toán</p>;
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const createOrder = async (paymentMethod) => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethod,
        address,
        phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");
    return data;
  };

  const handleSubmit = async (paymentMethod) => {
    if (!address || !phone) {
      setError("Vui lòng nhập đầy đủ địa chỉ và số điện thoại");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createOrder(paymentMethod);
      await clearCart();
      navigate(`/order-success?type=${paymentMethod}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Thanh toán</h2>

      <div style={{ marginBottom: 20 }}>
        <h4>Thông tin giao hàng</h4>

        <input
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        {error && <div style={styles.error}>{error}</div>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Sản phẩm</h4>

        {cart.items.map((item) => (
          <div key={item._id} style={styles.item}>
            <span>{item.product.name}</span>
            <span>x {item.quantity}</span>
            <span>
              {(item.product.price * item.quantity).toLocaleString()} ₫
            </span>
          </div>
        ))}
      </div>

      <div style={styles.total}>
        <span>Tổng tiền:</span>
        <span>{totalPrice.toLocaleString()} ₫</span>
      </div>

      <button
        disabled={loading}
        onClick={() => handleSubmit("mock")}
        style={{ ...styles.button, background: "#2e7d32" }}
      >
        Thanh toán Mock Payment
      </button>

      <button
        disabled={loading}
        onClick={() => handleSubmit("cod")}
        style={styles.button}
      >
        Thanh toán khi nhận hàng (COD)
      </button>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  error: {
    marginTop: 6,
    color: "#d32f2f",
    fontSize: 14,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    background: "#ee4d2d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
};

export default Checkout;
