import Order from "../model/Order.js";

export const payOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  if (order.userId.toString() !== req.user.id)
    return res.status(403).json({ message: "Không có quyền" });

  if (order.status !== "pending")
    return res.status(400).json({ message: "Không thể thanh toán đơn này" });

  order.isPaid = true;
  order.paymentMethod = "mock";
  order.paidAt = new Date();
  order.status = "completed";

  await order.save();
  res.json(order);
};
