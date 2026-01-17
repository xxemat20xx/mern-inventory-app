import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
        //otherwise create user
        const newUser = new User({ email, password, name });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}
// ============ LOGIN ============ //
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select("+password");
      if(!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: "Invalid credentials" });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      //SINGLE SESSION (rotate)
      user.refreshTokens = [refreshToken];
      await user.save();

      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
// ============ LOGOUT ============ //
export const logout = async (req, res) => {}

// ============ REFRESH TOKEN ============ //
export const refreshToken = async (req, res) => {}

// ============ GET CURRENT USER ============ //
export const getCurrentUser = async (req, res) => {}