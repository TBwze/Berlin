import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import commentRoute from "./routes/CommentRoute.js";
import cors from "cors";
import dotenv from "dotenv";
import "./utils/Cloudinary.js";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/user", userRoute);
app.use("/comment", commentRoute);

mongoose
    .connect(process.env.ATLAS_URI, {
        dbName: "crowdfunding-skripsi",
    })
    .then(() => {
        console.log("App connected to database");
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: ${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });
