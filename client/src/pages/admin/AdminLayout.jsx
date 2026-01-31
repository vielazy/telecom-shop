import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          background: "#1e1e2f",
          color: "#fff",
          padding: 16,
        }}
      >
        <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Admin Panel
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li onClick={() => navigate("/admin/users")}>👤 Users</li>
          <li onClick={() => navigate("/admin/orders")}>📦 Orders</li>
        </ul>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
