import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />

      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()} ₫</p>

      <Link to={`/products/${product._id}`}>Xem chi tiết</Link>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "16px",
    width: "220px",
  },
  image: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
  },
};

export default ProductCard;
