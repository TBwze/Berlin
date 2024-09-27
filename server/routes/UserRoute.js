import express from "express";
import {
    create,
    login,
    edit,
    destroy,
    getAccountInfo,
    getAllUsers,
} from "../controller/UserController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";
import { uploadSingle } from "../middleware/MulterMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/", uploadSingle, create);

// Login
router.post("/login", login);

// Get profile
router.get("/account", authenticateToken, getAccountInfo);

// Get all Users
router.get("/all", getAllUsers);

// Update one
router.put("/update", uploadSingle, authenticateToken, edit);

// Delete one
router.delete("/:id", destroy);

export default router;
