import jwt from "jsonwebtoken";
import { handleErrorResponse } from "../helper/Response.js";

export const authenticateToken = (request, response, next) => {
    const token = request.cookies.token;

    if (!token) {
        return handleErrorResponse(
            response,
            401,
            "Access Denied: No token provided"
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return handleErrorResponse(
                response,
                401,
                "Token has expired. Please login again"
            );
        }
        return handleErrorResponse(response, 403, "Invalid token");
    }
};
