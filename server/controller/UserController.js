import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { deleteImage, uploadImage } from "../utils/Cloudinary.js";

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

        let profilePictureUrl = null;

        if (request.file) {
            const uploadResult = await uploadImage(request.file.buffer);
            profilePictureUrl = uploadResult.url;
        }

        const newUser = {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
            role: "User",
            wallet: request.body.wallet,
            profilePicture: profilePictureUrl,
        };

        const user = await User.create(newUser);
        return response.status(201).send(user);
    } catch (error) {
        response.status(500).send({
            message: error.message,
        });
    }
};

export const login = async (request, response) => {
    const { email, password, wallet } = request.body;

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

        if (wallet.toLowerCase() !== user.wallet.toLowerCase()) {
            return response.status(400).json({
                message: "User wallet does not match!",
            });
        }
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, wallet: user.wallet },
            process.env.JWT_SECRET
        );

        response.json({
            message: "Welcome Back!",
            token: jwtToken,
        });
    } catch (err) {
        response
            .status(500)
            .json({ message: "An error occurred during login" });
    }
};

export const getAccountInfo = async (request, response) => {
    try {
        const userId = request.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        response.json(user);
    } catch (error) {
        response.status(500).json({ message: "An error occurred" });
    }
};

export const getAllUsers = async (request, response) => {
    try {
        const users = await User.find({ role: "user" });
        return response.status(200).json(users);
    } catch (error) {
        return response.status(500).json({ message: "Error fetching users" });
    }
};

export const edit = async (request, response) => {
    try {
        const userId = request.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const { firstname, lastname, username, email, password } = request.body;

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (request.file) {
            if (user.profilePicture) {
                const publicId = user.profilePicture
                    .split("/")
                    .pop()
                    .split(".")[0];
                await deleteImage(publicId);
            }

            const uploadResult = await uploadImage(request.file.buffer);
            user.profilePicture = uploadResult.url;
        }

        await user.save();

        return response.status(200).json(user);
    } catch (error) {
        response.status(500).json({ message: error.message });
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
        response.status(500).send({
            message: error.message,
        });
    }
};
