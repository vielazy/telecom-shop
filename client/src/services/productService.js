const API_URL = "http://localhost:5000/api/products";


export const getAllProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không lấy được sản phẩm");
  return res.json();
};


export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// 👑 ADMIN
export const createProduct = async (data, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProductByAdmin = async (id, data, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateStockByAdmin = async (id, stock, token) => {
  const res = await fetch(`${API_URL}/${id}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stock }),
  });
  return res.json();
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
