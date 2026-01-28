import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const genToken = (payload, exp) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, password: hash });
  res.status(201).json(user);
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
  res.clearCookie("refreshToken");
  res.json({ message: "Đã logout" });
};
