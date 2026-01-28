import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

export const createOrder = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Giỏ hàng trống" });

  const pending = await Order.findOne({
    userId,
    status: "pending",
    isDeleted: false,
  });
  if (pending)
    return res.status(400).json({ message: "Bạn đang có đơn chưa xử lý" });

  let totalAmount = 0;
  const items = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock === 0)
      return res.status(400).json({ message: "Sản phẩm không hợp lệ" });

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = new Order({ userId, items, totalAmount });
  await order.save();
  await Cart.deleteOne({ userId });

  res.status(201).json({ message: "Tạo đơn thành công", order });
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price image");

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      orders,
    });
  } catch (error) {
    console.error("Lỗi getOrdersByUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      userId,
      isDeleted: false,
    }).populate("items.product", "name price image");

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi getOrderById:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * ❌ USER – Huỷ đơn hàng (SOFT DELETE)
 */
export const cancelOrderByUser = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order || order.isDeleted) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Không có quyền huỷ đơn này",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        message: "Không thể huỷ đơn đã hoàn tất",
      });
    }

    order.status = "cancelled";
    order.isDeleted = true;
    order.deletedAt = new Date();

    await order.save();

    res.status(200).json({
      message: "❌ Đã huỷ đơn hàng",
      order,
    });
  } catch (error) {
    console.error("Lỗi cancelOrderByUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * 👑 ADMIN – Lấy toàn bộ đơn hàng
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("userId", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Admin lấy toàn bộ đơn hàng",
      orders,
    });
  } catch (error) {
    console.error("Lỗi getAllOrders:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * 👑 ADMIN – Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatus = ["pending", "shipped", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
      });
    }

    const order = await Order.findById(orderId);
    if (!order || order.isDeleted) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (status === "completed" && !order.isPaid) {
      return res.status(400).json({
        message: "Đơn hàng chưa thanh toán",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "✅ Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi updateOrderStatus:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};