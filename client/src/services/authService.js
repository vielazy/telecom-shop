const API_URL = "http://localhost:5000/api/auth";

export const register = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // để nhận refreshToken cookie
    body: JSON.stringify(data),
  });
  return res.json();
};

export const refreshToken = async () => {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const getMe = async (token) => {
  const res = await fetch(`http://localhost:5000/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
