import jwt from "jsonwebtoken";

export const authenticateToken = (request, response, next) => {
    const token = request.cookies.token;

    if (!token) {
        return response
            .status(401)
            .json({ message: "Access Denied: No token provided" });
    }

    try {
        // Verify token and attach user data to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return response.status(401).json({
                message: "Token has expired. Please login again",
            });
        }
        return response.status(403).json({
            message: "Invalid token",
        });
    }
};
