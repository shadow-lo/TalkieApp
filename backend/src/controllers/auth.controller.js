import bcrypt from "bcryptjs";

import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { handleError } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });

    const user = await User.findOne({ email: email });

    if (user) return res.status(400).json({ message: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //Generate jwt token.
      generateToken(newUser._id, res);
      await newUser.save();

      const userObject = newUser.toObject();
      delete userObject.password;

      res.status(201).json(userObject);
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    handleError(res, error, "signup");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials." });

    generateToken(user._id, res);

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json(userObject);
  } catch (error) {
    handleError(res, error, "login");
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    handleError(res, error, "logout");
  }
};

export const updateProfile = async (req, res) => {
  const { profilePic, fullName, email, description } = req.body;
  const userId = req.user._id;

  try {
    const updateData = {};

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (description) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
    req.io.emit("userProfileUpdated", updatedUser);
  } catch (error) {
    handleError(res, error, "updateProfile");
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    handleError(res, error, "checkAuth");
  }
};
