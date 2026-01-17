
import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
    register,
    login,
    logout,
    refreshToken,
    getCurrentUser,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.post("/refresh-token", refreshToken);
router.get("/getCurrentUser", protectedRoute, getCurrentUser);



export default router;