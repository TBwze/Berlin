import jwt from "jsonwebtoken";

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return response
            .status(401)
            .json({ message: "Access Denied: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return response.status(403).json({ message: "Invalid token" });
        }

        // Attach user data (decoded from token) to the request object
        request.user = user;
        next();
    });
};
