import { createContext, useContext, useEffect, useState } from "react";
import * as cartService from "../services/cartService";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  const loadCart = async () => {
    if (!token) return;
    const res = await cartService.getMyCart(token);
    if (res.cart) setCart(res.cart);
  };

  const addToCart = async (productId, quantity) => {
    await cartService.addToCart(productId, quantity, token);
    loadCart();
  };

  const removeFromCart = async (productId) => {
    await cartService.removeFromCart(productId, token);
    loadCart();
  };

  const clearCart = async () => {
    await cartService.clearCart(token);
    setCart({ items: [] });
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
