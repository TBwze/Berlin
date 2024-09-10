import express from "express";
import {
    create,
    login,
    edit,
    destroy,
    getAccountInfo,
} from "../controller/UserController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";
import { upload } from "../middleware/MulterMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/", upload.single("profilePicture"), create);

//login
router.post("/login", login);

// get profile
router.get("/account", authenticateToken, getAccountInfo);

// Update one
router.put("/update", authenticateToken, upload.single("profilePicture"), edit);

// Delete one
router.delete("/:id", destroy);

export default router;
