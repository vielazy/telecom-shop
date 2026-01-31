export const deleteUser = async (userId, token) => {
  const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Xoá thất bại");
  return data;
};
