import { User } from "../models/user.model.js";


import {
    register,
    login,
    logout,
    refreshToken,
    getCurrentUser,
} from "../controller/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.post("/refresh-token", refreshToken);
router.get("/getCurrentUser", getCurrentUser);



export default router;