import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const { user, loading, logout } = useContext(AuthContext);

  const [keyword, setKeyword] = useState("");

  if (loading) return null;

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/?q=${keyword}`);
    setKeyword("");
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* LOGO */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          TelecomShop
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            placeholder="Tìm thiết bị viễn thông..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        {/* ACTIONS */}
        <div className="header-actions">
          {/* CART */}
          <div className="cart-icon" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>

          {/* AUTH / MENU */}
          {!user ? (
            <div className="auth-links">
              <span onClick={() => navigate("/login")}>Đăng nhập</span>
              <span className="divider">/</span>
              <span onClick={() => navigate("/register")}>Đăng ký</span>
            </div>
          ) : user.role === "admin" ? (
            <div className="auth-links">
              <span onClick={() => navigate("/admin")}>Admin</span>
              <span className="divider">|</span>
              <span
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </span>
            </div>
          ) : (
            <div className="auth-links">
              <span onClick={() => navigate("/my-orders")}>Đơn hàng</span>
              <span className="divider">|</span>
              <span
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </span>
            </div>
          )}
        </div>
      </div>

      <nav className="category-bar">
        <a>Router</a>
        <a>Modem</a>
        <a>Switch</a>
        <a>Camera</a>
        <a>Phụ kiện</a>
      </nav>
    </header>
  );
}
