const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {

    const authorization = req.headers['authorization'];

    const token = (String(authorization).startsWith('Bearer ')) ? authorization.slice(7, authorization.length) : authorization;

    if (token) {
        jwt.verify(token, process.env.SECRET_API_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ error: `Token Expired` });
                }
                return res.status(401).json({ error: `Invalid Token` });
            }
            //console.log(decoded)
            req.auth = decoded;
            return next();
        });
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = auth;