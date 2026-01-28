import { useEffect, useState, useContext } from "react";
import { getAllUsers } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";

const AdminUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers(token).then((res) => {
      if (res.users) setUsers(res.users);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Quản lý người dùng</h2>

      {users.map((u) => (
        <div
          key={u._id}
          style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}
        >
          <p>Email: {u.email}</p>
          <p>Role: {u.role}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
