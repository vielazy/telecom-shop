import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0)
    return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

  if (quantity > 10)
    return res.status(400).json({ message: "Vượt quá số lượng cho phép" });

  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  if (product.stock === 0)
    return res.status(400).json({ message: "Sản phẩm đã hết hàng" });

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ product: productId, quantity }] });
  } else {
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) {
      if (item.quantity + quantity > 10)
        return res.status(400).json({ message: "Tổng số lượng vượt quá 10" });
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();
  res.json({ message: "Đã thêm vào giỏ hàng", cart });
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteOne({ userId });

    res.status(200).json({
      message: "🧹 Đã xoá toàn bộ giỏ hàng",
    });
  } catch (error) {
    console.error("clearCart error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate(
      "items.product",
      "name price image",
    );

    if (!cart) {
      return res.status(200).json({
        message: "Giỏ hàng trống",
        cart: { items: [] },
      });
    }

    res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("getMyCart error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      message: "❌ Đã xoá sản phẩm khỏi giỏ hàng",
      cart,
    });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity không hợp lệ" });
  }

  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  }

  const item = cart.items.find((i) => i.product.toString() === productId);

  if (!item) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  item.quantity = quantity;
  await cart.save();

  res.json({
    message: "Cập nhật số lượng thành công",
    cart,
  });
};

