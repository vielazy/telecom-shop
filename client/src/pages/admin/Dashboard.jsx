import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard</h2>

      <ul>
        <li>
          <Link to="/admin/orders">Quản lý đơn hàng</Link>
        </li>
        <li>
          <Link to="/admin/products">Quản lý sản phẩm</Link>
        </li>
        <li>
          <Link to="/admin/users">Quản lý người dùng</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
