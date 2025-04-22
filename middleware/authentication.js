const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
    const secret_key = process.env.JWT_SECRET_KEY;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const user = jwt.verify(token, secret_key);
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Forbidden: Token expired, please login again" });
        } else {
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }
    }
};

module.exports = authentication;
