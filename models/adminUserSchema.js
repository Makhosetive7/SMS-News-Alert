import mongoose from "mongoose";

const adminUseSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ["admin", "reader"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("adminUser", adminUseSchema);
