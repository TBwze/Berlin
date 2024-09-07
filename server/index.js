import e from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";

const app = e();

app.use(e.json);
app.use(
    cors({
        methods: [GET, POST, PUT, DELETE],
        allowedHeaders: ["Content-Type"],
    })
);

app.use("/users", userRoute);

mongoose
    .connect(process.env.ATLAS_URI, {
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
