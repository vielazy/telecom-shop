import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod } = req.body;

    if (!["mock", "cod"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    
    if (paymentMethod === "cod") {
      const pending = await Order.findOne({
        userId,
        status: "pending",
        isDeleted: false,
      });
      if (pending) {
        return res
          .status(400)
          .json({ message: "Bạn đang có đơn COD chưa xử lý" });
      }
    }

    let totalAmount = 0;
    const items = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product?.name || ""} không đủ tồn kho`,
        });
      }

      
      product.stock -= item.quantity;
      await product.save();

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      status: paymentMethod === "mock" ? "completed" : "pending",
      isPaid: paymentMethod === "mock",
      paidAt: paymentMethod === "mock" ? new Date() : null,
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.status(201).json({
      message: "✅ Tạo đơn hàng thành công",
      order,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
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

export const cancelOrderByUser = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Không có quyền huỷ đơn này" });
    }

    if (order.status === "completed") {
      return res.status(400).json({ message: "Không thể huỷ đơn đã hoàn tất" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "❌ Đã huỷ đơn hàng",
      order,
    });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("userId", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 }); 
    res.status(200).json({
      orders,
      total: orders.length,
    });
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

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

export const confirmCOD = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.paymentMethod !== "cod") {
      return res.status(400).json({ message: "Đơn hàng không phải COD" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Đơn hàng đã được xác nhận" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "completed";

    await order.save();

    res.json({
      message: "✅ Đã xác nhận thanh toán COD",
      order,
    });
  } catch (err) {
    console.error("CONFIRM COD ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

