const express = require("express");
const jwt = require("jsonwebtoken");
const user = express.Router();
const db = require("../config/database");
const auth = require("../middleware/auth");

user.post("/signin", auth, async (req, res, next) => {
    const { user_mail, user_password } = req.body;

    if(user_mail && user_password) {
        const existe = await db.query("SELECT * FROM usuarios WHERE user_mail = ?", [user_mail]);
        if(existe.length > 0) {
            return res.status(409).json({ code: 409, message: "Ya existe un usuario con ese correo" });
        }

        let query = "INSERT INTO usuarios (user_mail, user_password)";
        query += " VALUES (?, ?)";
        const rows = await db.query(query, [user_mail, user_password]);
        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 1, message: "Usuario agregado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error al agregar Usuario" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

user.post("/login", async (req, res, next) => {
    const { user_mail, user_password } = req.body;
    const query = "SELECT * FROM usuarios WHERE user_mail = ? AND user_password = ?";
    const rows = await db.query(query, [user_mail, user_password]);

    if (user_mail && user_password) {
        if (rows.length == 1) {
            const token = jwt.sign({
                user_id: rows[0].user_id,
                user_mail: rows[0].user_mail,
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        }
        else {
            return res.status(401).json({ code: 401, message: "Usuario o contraseña incorrectos" });
        }
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

user.get("/", auth, async (req, res, next) => {
    const query = "SELECT user_id, user_mail FROM usuarios";
    const rows = await db.query(query);

    return res.status(200).json({ code: 1, message: "Usuarios obtenidos correctamente", data: rows });
});

module.exports = user;