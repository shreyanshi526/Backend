const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    try {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(409);
                    throw new Error("User is not authorized");
                } else {
                    req.user = decoded.user;
                    if (req.user) {
                        next();
                    } else {
                        res.status(401);
                        throw new Error("No user found");
                    }
                }
            });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = validateToken;
