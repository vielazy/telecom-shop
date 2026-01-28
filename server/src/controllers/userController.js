import User from "../model/User.js";

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken",
  );
  if (!user) return res.status(404).json({ message: "User không tồn tại" });

  res.json(user);
};

export const updateMe = async (req, res) => {
  const { username, email } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { username, email },
    { new: true },
  ).select("-password -refreshToken");

  res.json(updated);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.json(users);
};
