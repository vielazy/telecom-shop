import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, updateQuantity, removeFromCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Giỏ hàng</h2>
        <p>🛒 Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Giỏ hàng</h2>

      {cart.items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onIncrease={() => addToCart(item.product._id, 1)}
          onDecrease={() => updateQuantity(item.product._id, item.quantity - 1)}
          onRemove={() => removeFromCart(item.product._id)}
        />
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: 18,
          marginTop: 20,
          borderTop: "2px solid #eee",
          paddingTop: 16,
        }}
      >
        <span>Tổng tiền:</span>
        <span style={{ color: "#e53935" }}>
          {totalPrice.toLocaleString()} ₫
        </span>
      </div>

      <button
        style={{
          marginTop: 20,
          width: "100%",
          padding: "12px 0",
          fontSize: 16,
          background: "#ee4d2d",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={() => navigate("/checkout")}
      >
        Tiến hành đặt hàng
      </button>
    </div>
  );
};

export default Cart;
