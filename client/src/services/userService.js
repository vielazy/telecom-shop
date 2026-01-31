const API_URL = "http://localhost:5000/api/users";

export const getAllUsers = async (token) => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách user");
  }

  return res.json();
};
