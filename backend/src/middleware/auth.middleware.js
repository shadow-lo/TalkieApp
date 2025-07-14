import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import { handleError } from "../lib/utils.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or missing token." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const isExpired = err.name === "TokenExpiredError";
      return res.status(401).json({
        message: isExpired
          ? "Unauthorized - Token expired."
          : "Unauthorized - Invalid or missing token.",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    handleError(res, error, "protectRoute");
  }
};
