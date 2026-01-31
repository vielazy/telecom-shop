import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(id);
      setProduct(res.product || res);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Đang tải sản phẩm...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 300, borderRadius: 8 }}
        />

        <div>
          <h2>{product.name}</h2>
          <p style={{ color: "#e53935", fontSize: 22 }}>
            {product.price.toLocaleString()} ₫
          </p>

          <p>
            <b>Thương hiệu:</b> {product.brand || "Đang cập nhật"}
          </p>
          <p>
            <b>Tác dụng:</b> {product.description}
          </p>
          <p>
            <b>Bảo hành:</b> {product.warranty || "12 tháng"}
          </p>
          <p>
            <b>Số lượng còn:</b> {product.stock}
          </p>

          <button
            style={{
              marginTop: 16,
              padding: "10px 20px",
              background: "#ee4d2d",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
