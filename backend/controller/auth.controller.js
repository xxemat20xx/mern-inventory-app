import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookie.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

// ============ REGISTER ============ //
export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============ LOGIN ============ //
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // SINGLE SESSION (rotate)
    user.refreshTokens = [refreshToken];
    await user.save();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============ LOGOUT ============ //
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken; // ✅ fixed

  try {
    if (token) {
      await User.updateOne(
        { refreshTokens: token },
        { $pull: { refreshTokens: token } }
      );
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============ REFRESH TOKEN ============ //
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken; // ✅ fixed

  try {
    if (!token) return res.sendStatus(401); // unauthorized

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(token)) return res.sendStatus(403);

    // rotate tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens = [newRefreshToken];
    await user.save();

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};

// ============ GET CURRENT USER ============ //
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -refreshTokens"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
