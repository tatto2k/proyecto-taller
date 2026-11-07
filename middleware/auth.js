const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ code: 401, message: "Token no proporcionado" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        const verified = jwt.verify(token, "debugkey");
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ code: 401, message: "Token inválido" });
    }
};
