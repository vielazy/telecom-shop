import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res?.accessToken) {
        navigate("/");
      } else {
        setError(res.message || "Đăng nhập thất bại");
      }
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Đăng nhập</h2>

        <div className="auth-field">
          <input
            className={`auth-input ${error ? "error" : ""}`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!email && error && (
            <small className="auth-error">Vui lòng nhập email</small>
          )}
        </div>

        <div className="auth-field">
          <input
            type="password"
            className={`auth-input ${error ? "error" : ""}`}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!password && error && (
            <small className="auth-error">Vui lòng nhập mật khẩu</small>
          )}
        </div>

        {error && <div className="auth-error global">{error}</div>}

        <button className="auth-btn" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
        </button>

        <div className="auth-footer">
          <span>Bạn chưa có tài khoản?</span>
          <Link to="/register">Đăng ký</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
