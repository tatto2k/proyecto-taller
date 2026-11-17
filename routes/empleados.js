const express = require("express");
const empleados = express.Router();
const db = require("../config/database");

empleados.post("/", async (req, res, next) => {
    const { emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion } = req.body;

    if(emp_nombre && emp_apellidos && emp_telefono && emp_correo && emp_direccion){
        const existe = await db.query("SELECT * FROM empleados WHERE emp_correo = ?", [emp_correo]);
        if(existe.length > 0) {
            return res.status(409).json({ code: 409, message: "Ya existe un empleado con ese correo" });
        }

        let query = "INSERT INTO empleados (emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion)";
        query += " VALUES (?, ?, ?, ?, ?)";

        const rows = await db.query(query, [emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion]);
        console.log(rows);

        if(rows.affectedRows == 1) {
            return res.status(201).json({ code: 1, message: "Empleado agregado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrio un error al agregar Empleado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

empleados.delete("/:id", async (req, res, next) => {
    const query = "DELETE FROM empleados WHERE emp_id = ?";

    const rows = await db.query(query, [req.params.id]);

    if(rows.affectedRows == 1) {
        return res.status(200).json({ code: 1, message: "Empleado eliminado correctamente" });
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

empleados.put("/:id", async (req, res, next) => {
    const { emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion } = req.body;

    if(emp_nombre && emp_apellidos && emp_telefono && emp_correo && emp_direccion){
        const existe = await db.query("SELECT * FROM empleados WHERE emp_correo = ? AND emp_id != ?", [emp_correo, req.params.id]);
        if(existe.length > 0) {
            return res.status(409).json({ code: 409, message: "Ya existe un empleado con ese correo" });
        }

        let query = "UPDATE empleados SET emp_nombre = ?, emp_apellidos = ?, emp_telefono = ?,";
        query += " emp_correo = ?, emp_direccion = ? WHERE emp_id = ?";

        const rows = await db.query(query, [emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion, req.params.id]);

        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

empleados.patch("/:id", async (req, res, next) => {
    if(req.body.emp_nombre) {
        const query = "UPDATE empleados SET emp_nombre = ? WHERE emp_id = ?";

        const rows = await db.query(query, [req.body.emp_nombre, req.params.id]);

        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
        }
        return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

empleados.get("/", async (req, res, next) => {
    const emp = await db.query("SELECT * FROM empleados");
    return res.status(200).json({ code: 1, message: emp });
});

empleados.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (id >= 1) {
        const emp = await db.query("SELECT * FROM empleados WHERE emp_id = ?", [id]);
        if (emp.length > 0) {
            return res.status(200).json({ code: 1, message: emp });
        }
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

empleados.get("/name/:name", async (req, res, next) => {
    const name = req.params.name;
    const query = "SELECT * FROM empleados WHERE CONCAT(emp_nombre, ' ', emp_apellidos) LIKE ?";
    const emp = await db.query(query, [`%${name}%`]);

    return res.status(200).json({ code: 1, message: emp });
});

module.exports = empleados;