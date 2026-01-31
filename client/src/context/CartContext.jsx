import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as cartService from "../services/cartService";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  
  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await cartService.getMyCart(token);
      setCart(res?.cart || { items: [] });
    } catch {
      setCart({ items: [] });
    }
  };

 
  useEffect(() => {
    if (token) {
      loadCart();
    }
  }, [token]);

  
  useEffect(() => {
    if (!user) {
      setCart({ items: [] });
    }
  }, [user]);

  
  const addToCart = async (productId, quantity = 1) => {
    if (!token) return;

   
    setCart((prev) => {
      const items = [...prev.items];
      const idx = items.findIndex((i) => i.product._id === productId);

      if (idx !== -1) {
        items[idx] = {
          ...items[idx],
          quantity: items[idx].quantity + quantity,
        };
      } else {
        items.push({
          product: { _id: productId },
          quantity,
        });
      }

      return { ...prev, items };
    });

    try {
      await cartService.addToCart(productId, quantity, token);
      await loadCart();
    } catch {
      await loadCart();
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!token) return;

    setCart((prev) => {
      const items = prev.items
        .map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);

      return { ...prev, items };
    });

    await loadCart();
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token || quantity < 1) return;

    setCart((prev) => {
      const items = prev.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      );
      return { ...prev, items };
    });

    try {
      await cartService.updateQuantity(productId, quantity, token);
      await loadCart();
    } catch {
      await loadCart();
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;

    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.product._id !== productId),
    }));

    try {
      await cartService.removeFromCart(productId, token);
      await loadCart();
    } catch {
      await loadCart();
    }
  };

  const clearCart = async () => {
    if (!token) return;
    await cartService.clearCart(token);
    setCart({ items: [] });
  };

 
  const cartCount = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loadCart,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
