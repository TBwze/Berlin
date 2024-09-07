import express from "express";
import {
    create,
    findAll,
    findOne,
    edit,
    destroy,
} from "../controller/UserController.js";

const router = express.Router();

// Upload new
router.post("/", create);

// Find all
router.get("/", findAll);

// Find one
router.get("/:id", findOne);

// Update one
router.put("/:id", edit);

// Delete one
router.delete("/:id", destroy);

export default router;
