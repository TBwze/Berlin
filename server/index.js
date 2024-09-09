import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import cors from "cors";
import { ATLAS_URI, PORT } from "./config.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);

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
