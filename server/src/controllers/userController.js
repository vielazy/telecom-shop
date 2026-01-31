import User from "../model/User.js";
import Order from "../model/Order.js";


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true },
    ).select("-password -refreshToken");

    res.status(200).json({ user: updated });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");

    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({
          userId: user._id,
          isDeleted: false,
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          orderCount,
        };
      }),
    );

    res.status(200).json({ users: usersWithOrderCount });
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({ message: "Không thể xoá chính mình" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User không tồn tại" });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: "Xoá người dùng thành công" });
};

