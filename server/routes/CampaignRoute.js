import express from "express";
import { create } from "../controller/CampaignController.js";

const router = express.Router();

router.post("/create", create);
