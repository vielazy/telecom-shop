import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.items.length) {
    return <p>🛒 Giỏ hàng trống</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Giỏ hàng</h2>

      {cart.items.map((item) => (
        <CartItem
          key={item.product._id}
          item={item}
          onRemove={removeFromCart}
        />
      ))}

      <button onClick={() => navigate("/checkout")}>Tiến hành đặt hàng</button>
    </div>
  );
};

export default Cart;
