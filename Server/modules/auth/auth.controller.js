const User = require("../../database/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../utils/helperFunctions");

exports.register = async (req, res) => {
  console.log("Received registration request with body:", req.body); // Debug log
  try {
    let { name, email, phone, profession,password, role, city } = req.body;

    if (!name || !email || !phone || !profession || !city || !password || !role) {
      return res.status(400).json({
        message: "Name, email, phone, profession, city, password and role are required",
      });
    }
    // const password = "123456789"; // Default password for all users

    email = email.toLowerCase().trim();
    phone = phone.trim();

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone already exists",
      });
    }

    // 1️⃣ Create User
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      profession,
      city,
    });

    return res.status(201).json({
      message: `User registered successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profession: user.profession,
        city: user.city,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: error.message || "Server error during registration",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        profession: user.profession,
        city: user.city,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        status: user.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error during login" });
  }
};

exports.updateUserProfile = async (req, res) => {
  console.log("Received profile update request with body:", req.body); // Debug log
  console.log("Authenticated user ID from token:", req.user); // Debug log
  try {
    const userId = req.user.id;
    const { name, email, phone, profession, city, bio } = req.body;
    const updateData = { name, email, phone, profession, city, bio };

    // Remove undefined fields from updateData
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profession: updatedUser.profession,
        city: updatedUser.city,
        bio: updatedUser.bio,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error during profile update",
    });
  }
};
