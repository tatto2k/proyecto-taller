const express = require("express");
const jwt = require("jsonwebtoken");
const user = express.Router();
const db = require("../config/database");

user.post("/login", async (req, res, next) => {
    const { user_mail, user_password } = req.body;

    if (!user_mail || !user_password) {
        return res.status(400).json({ code: 400, message: "Campos incompletos" });
    }

    try {
        const query = "SELECT * FROM usuarios WHERE user_mail = ? AND user_password = ?;";
        const rows = await db.query(query, [user_mail, user_password]);

        if (rows.length === 1) {
            const token = jwt.sign({
                user_id: rows[0].user_id,
                user_mail: rows[0].user_mail,
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        } else {
            return res.status(401).json({ code: 401, message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
});

module.exports = user;
