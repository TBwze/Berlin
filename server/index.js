import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import campaignRoute from "./routes/CampaignRoute.js";
import cors from "cors";
import { ATLAS_URI, PORT } from "./config.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/user", userRoute);
app.use("/campaign", campaignRoute);
app.use("/assets", express.static(path.join(__dirname, "assets")));

mongoose
    .connect(ATLAS_URI, {
        dbName: "crowdfunding-skripsi",
    })
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });
