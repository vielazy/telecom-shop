import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={styles.header}>
      <h2>📡 Telecom Shop</h2>

      <nav style={styles.nav}>
        <Link to="/">Trang chủ</Link>
        <Link to="/cart">Giỏ hàng</Link>
        <Link to="/my-orders">Đơn hàng</Link>

        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {user ? (
          <button onClick={logout}>Đăng xuất</button>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: "16px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nav: {
    display: "flex",
    gap: "16px",
  },
};

export default Header;
