import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Cart from "../model/Cart.js";

const genToken = (payload, exp) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Sai thông tin" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Sai thông tin" });

  const accessToken = genToken({ id: user._id, role: user.role }, "15m");
  const refreshToken = genToken({ id: user._id }, "7d");

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ accessToken, user });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const accessToken = genToken({ id: payload.id }, "15m");

  res.json({ accessToken });
};

export const logout = async (req, res) => {
  const userId = req.user.id;

  await Cart.findOneAndDelete({ userId });

  await Order.deleteMany({
    userId,
    status: "pending",
    isPaid: false,
  });

  res.clearCookie("refreshToken");
  res.json({ message: "Đã đăng xuất" });
};

