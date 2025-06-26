import express from "express";
import adminUser from "../../models/adminUserSchema.js";

const router = express.Router();

// Register Admin
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const accountExisting = await adminUser.findOne({ email });
    if (accountExisting) {
      return res.status(400).json({ error: "Admin account already exists" });
    }

    const admin = new adminUser({ firstName, lastName, username, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminUser.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // 🔐 Compare password (in real app, hash and compare)
    if (admin.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
