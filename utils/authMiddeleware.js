const jwt = require("jsonwebtoken");
const  secretKey  = require("../configuration/jwtConfig");  // Import the secret key

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");
    
    
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

   
    jwt.verify(authHeader,"secretKey", (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Forbidden: Invalid token",code:401 });
        }


        req.user = user;
        
        next();
    });
    
}

module.exports = { authenticateToken };
