const API_URL = "http://localhost:5000/api/cart";

export const getMyCart = async (token) => {
  const res = await fetch(`${API_URL}/my-cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const addToCart = async (productId, quantity, token) => {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
};

export const removeFromCart = async (productId, token) => {
  const res = await fetch(`${API_URL}/remove/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const clearCart = async (token) => {
  const res = await fetch(`${API_URL}/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
