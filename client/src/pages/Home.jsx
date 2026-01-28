import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts();
      setProducts(res);
    };
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Thiết bị viễn thông</h2>

      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
};

export default Home;
