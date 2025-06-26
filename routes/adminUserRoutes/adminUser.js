import express from "express";
import adminUser from "../../models/adminUserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const router = express.Router();

const JWT_SECRET= "supersecret123456789";

// Register Admin
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  try {
    const accountExisting = await adminUser.findOne({ email });
    if (accountExisting) {
      return res.status(400).json({ error: "Admin account already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new adminUser({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });
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

    const isPasswordMarch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMarch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("JWT_SECRET is:", JWT_SECRET); 

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
