import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
// import campaignRoute from "./routes/CampaignRoute.js";
import cors from "cors";
import { ATLAS_URI, PORT } from "./config.js";
import dotenv from "dotenv";
import "./utils/Cloudinary.js";

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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", userRoute);
// app.use("/campaign", campaignRoute);

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
