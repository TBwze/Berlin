import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { deleteImage, uploadImage } from "../utils/Cloudinary.js";
import calculatePagination from "../helper/pagination.js";
import {
    handleErrorResponse,
    handleResponsePagination,
    handleSuccessResponse,
} from "../helper/Response.js";

export const create = async (request, response) => {
    try {
        if (
            !request.body.firstname ||
            !request.body.lastname ||
            !request.body.username ||
            !request.body.email ||
            !request.body.password ||
            !request.body.phonenumber
        ) {
            return handleErrorResponse(
                response,
                400,
                "Send all required fields!"
            );
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
            phonenumber: request.body.phonenumber,
            profilePicture: profilePictureUrl,
        };

        const user = await User.create(newUser);
        return handleSuccessResponse(response, 201, "Register Success", null);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const login = async (request, response) => {
    const { email, password, wallet } = request.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return handleErrorResponse(
                response,
                401,
                "Email or password or wallet does not match!"
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return handleErrorResponse(
                response,
                401,
                "Email or password or wallet does not match!"
            );
        }

        if (wallet.toLowerCase() !== user.wallet.toLowerCase()) {
            return handleErrorResponse(
                response,
                401,
                "Email or password or wallet does not match!"
            );
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, wallet: user.wallet },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        response.cookie("token", jwtToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return handleSuccessResponse(response, 200, "Login Success", null);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const getAccountInfo = async (request, response) => {
    try {
        const userId = request.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return handleErrorResponse(response, 404, "User not found");
        }
        return handleSuccessResponse(response, 200, "success", user);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const getAllUsers = async (request, response) => {
    try {
        let { page, limit, username } = request.query;

        page = parseInt(page) || 0;
        limit = parseInt(limit) || 10;

        const baseQuery = { role: "User" };
        if (username) {
            baseQuery.username = {
                $regex: username,
                $options: "i",
            };
        }

        const totalUsers = await User.countDocuments(baseQuery);
        const pagination = calculatePagination(page, limit, totalUsers);

        // Apply the same query for fetching users
        const users = await User.find(baseQuery)
            .skip(pagination.page * pagination.page_limit)
            .limit(pagination.page_limit);

        return handleResponsePagination(
            pagination.page,
            pagination.page_limit,
            pagination.total_pages,
            pagination.total_rows,
            response,
            200,
            "Users fetched successfully",
            users
        );
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const edit = async (request, response) => {
    try {
        const userId = request.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const { firstname, lastname, username, email, password, phonenumber } =
            request.body;

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (phonenumber) user.phonenumber = phonenumber;

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
        return handleSuccessResponse(response, 200, "Edit Success", user);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const destroy = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return handleErrorResponse(response, 404, "User not found!");
        }
        return handleSuccessResponse(
            response,
            200,
            "User deleted successfully!",
            null
        );
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const uploadProfilePicture = async (request, response) => {
    try {
        if (!request.file) {
            return handleErrorResponse(response, 400, "No file uploaded!");
        }

        let profilePictureUrl = null;
        const result = await uploadImage(request.file.buffer);
        profilePictureUrl = result.url;

        return handleSuccessResponse(
            response,
            200,
            "Image uploaded successfully!",
            profilePictureUrl
        );
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const getAccountByWallet = async (request, response) => {
    try {
        const { wallet } = request.query;

        if (!wallet) {
            return handleErrorResponse(
                response,
                400,
                "Wallet address is required!"
            );
        }

        const user = await User.findOne({ wallet });

        if (!user) {
            return handleErrorResponse(response, 404, "User not found!");
        }

        return handleSuccessResponse(response, 200, "Success!", user);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};

export const logout = async (request, response) => {
    try {
        response.cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
        });
        return handleSuccessResponse(
            response,
            200,
            "Logged out successfully!",
            null
        );
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occurred");
    }
};
