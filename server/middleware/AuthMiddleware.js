import jwt from "jsonwebtoken";
import Cookies from "cookies";

export const authenticateToken = (request, response, next) => {
    const cookies = new Cookies(request, response);
    const token = cookies.get("token");
    if (!token) {
        return response
            .status(401)
            .json({ message: "Access Denied: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return response.status(403).json({ message: "Invalid token" });
        }

        request.user = user;
        next();
    });
};
