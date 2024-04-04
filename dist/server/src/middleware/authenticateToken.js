import jwt from "jsonwebtoken";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (token == null)
        return res.sendStatus(401); // No token, unauthorized
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403); // Token is not valid or expired
        req.user = user;
        next(); // Token is valid, proceed
    });
};
export default authenticateToken;
//# sourceMappingURL=authenticateToken.js.map