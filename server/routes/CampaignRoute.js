import express from "express";
import {
    createCampaign,
    getAllCampaign,
    getCampaignFromId,
} from "../controller/CampaignController.js";

const router = express.Router();

router.get("/", getAllCampaign);
router.get("/:id", getCampaignFromId);
router.post("/create", createCampaign);
