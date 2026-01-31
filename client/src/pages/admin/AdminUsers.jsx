import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";
import "./AdminUsers.css";

const AdminUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Xoá thất bại");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
    } catch (err) {
      alert("Có lỗi xảy ra khi xoá user");
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <p>Đang tải danh sách người dùng...</p>;

  return (
    <div className="admin-users">
      <h2 className="admin-title">Quản lý người dùng</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Số đơn</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name || u.username || "—"}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge ${u.role}`}>{u.role}</span>
              </td>
              <td style={{ textAlign: "center" }}>{u.orderCount ?? 0}</td>
              <td style={{ textAlign: "center" }}>
                {u.role !== "admin" ? (
                  <button
                    className="btn-delete"
                    onClick={() => openDeleteModal(u)}
                  >
                    Xoá
                  </button>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={showModal}
        title="Xoá người dùng"
        message={`Bạn có chắc muốn xoá người dùng "${selectedUser?.email}" không?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default AdminUsers;
