import { useNavigate, useSearchParams } from "react-router-dom";

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const type = params.get("type");
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      {type === "mock" ? (
        <>
          <h2>🎉 Đặt hàng thành công</h2>
          <p>Đơn hàng đã được thanh toán và hoàn tất.</p>
        </>
      ) : (
        <>
          <h2>📦 Đặt hàng thành công</h2>
          <p>Đơn hàng đang chờ admin xác nhận thanh toán COD.</p>
        </>
      )}

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#ee4d2d",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default OrderSuccess;
