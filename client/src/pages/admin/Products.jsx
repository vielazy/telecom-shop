import { useEffect, useState, useContext } from "react";
import {
  getAllProducts,
  deleteProduct,
  updateStockByAdmin,
} from "../../services/productService";
import { AuthContext } from "../../context/AuthContext";

const AdminProducts = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await getAllProducts();
    setProducts(res);
  };

  const handleDelete = async (id) => {
    if (confirm("Xoá sản phẩm?")) {
      await deleteProduct(id, token);
      loadProducts();
    }
  };

  const handleStockChange = async (id, stock) => {
    await updateStockByAdmin(id, stock, token);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📡 Quản lý thiết bị viễn thông</h2>

      {products.map((p) => (
        <div
          key={p._id}
          style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}
        >
          <p>{p.name}</p>
          <p>Giá: {p.price.toLocaleString()} ₫</p>
          <p>Tồn kho: {p.stock}</p>

          <input
            type="number"
            defaultValue={p.stock}
            onBlur={(e) => handleStockChange(p._id, e.target.value)}
          />

          <button onClick={() => handleDelete(p._id)}>Xoá</button>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
