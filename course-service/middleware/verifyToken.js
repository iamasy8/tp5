const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(403).json({message: "access denied" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], "secret_key"); T
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({message: "token non valid" });
    }
}

module.exports = verifyToken;
