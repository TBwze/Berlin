import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const create = async (request, response) => {
    try {
        if (
            !request.body.firstname ||
            !request.body.lastname ||
            !request.body.username ||
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }

        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const profilePicture = request.file ? request.file.path : "";

        const newUser = {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
            role: "user",
            wallet: request.body.wallet,
            profilePicture: profilePicture || null,
        };

        const user = await User.create(newUser);
        return response.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            message: error.message,
        });
    }
};

export const login = async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email or password does not match!",
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return response.status(400).json({
                message: "Email or password does not match!",
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );

        response.json({
            message: "Welcome Back!",
            token: jwtToken,
        });
    } catch (err) {
        console.error("Error during login:", err);
        response
            .status(500)
            .json({ message: "An error occurred during login" });
    }
};

export const getAccountInfo = async (request, response) => {
    try {
        const userId = request.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        response.json(user);
    } catch (error) {
        console.error("Error fetching account information:", error);
        response.status(500).json({ message: "An error occurred" });
    }
};

export const edit = async (request, response) => {
    try {
        if (
            !request.body.firstname ||
            !request.body.lastname ||
            !request.body.username ||
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }
        const { id } = request.params;
        const result = await User.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).send({
                message: "User not found!",
            });
        }

        return response
            .status(200)
            .send({ message: "User updated successfully!" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            message: error.message,
        });
    }
};

export const destroy = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).send({
                message: "User not found!",
            });
        }
        return response
            .status(200)
            .send({ message: "User deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            message: error.message,
        });
    }
};
