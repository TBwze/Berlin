import { User } from "../model/User.js";
import jwt from "jsonwebtoken";

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

        const newUser = {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
            role: "user",
            wallet: request.body.wallet,
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

        if (!user || user.password !== password) {
            return response.status(400).json({
                message: "Email or password does not match!",
            });
        }

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET
        );

        response.json({ message: "Welcome Back!", token: jwtToken });
    } catch (err) {
        console.error("Error during login:", err);
        response
            .status(500)
            .json({ message: "An error occurred during login" });
    }
};

export const findAll = async (request, response) => {
    try {
        const users = await User.find({});
        return response.status(200).send({
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            message: error.message,
        });
    }
};

export const findOne = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await User.findById(id);
        return response.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            message: error.message,
        });
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
