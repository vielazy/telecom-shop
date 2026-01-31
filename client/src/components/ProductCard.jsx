import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={product.image} alt={product.name} />

      <button
        className="add-to-cart-btn"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
      >
        <FaCartPlus />
      </button>

      <div className="product-name">{product.name}</div>

      <div className="product-price">
        {Number(product.price).toLocaleString()} ₫
      </div>
    </div>
  );
}
