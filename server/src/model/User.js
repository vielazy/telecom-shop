import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: String,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
