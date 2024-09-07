import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import cors from "cors";
import { ATLAS_URI, PORT } from "./config.js";

const app = express();

app.use(express.json);
app.use(
    cors({
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use("/users", userRoute);

mongoose
    .connect(ATLAS_URI, {
        dbName: "crowdfunding",
    })
    .then(() => {
        console.log("App connected to database");
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });
