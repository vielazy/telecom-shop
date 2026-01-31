import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log("API DATA:", data);

        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ");
      return;
    }

    addToCart(product._id, 1);
  };


  return (
    <div className="home-container">
      <h2 className="section-title">Thiết bị bán chạy</h2>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
