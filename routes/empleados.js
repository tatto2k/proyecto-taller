const express = require("express");
const empleados = express.Router();
const db = require("../config/database");

empleados.post("/", async (req, res, next) => {
    const { emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion } = req.body;

    if (emp_nombre && emp_apellidos && emp_telefono && emp_correo && emp_direccion) {
        let query = "INSERT INTO empleados(emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion) ";
        query += "VALUES (?, ?, ?, ?, ?);";
        try {
            const rows = await db.query(query, [emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion]);
            if (rows.affectedRows == 1) {
                return res.status(201).json({ code: 201, message: "Empleado agregado correctamente" });
            }
            return res.status(500).json({ code: 500, message: "Ocurrió un error al agregar el empleado" });
        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                return res.status(409).json({ code: 409, message: "Ya existe un empleado con ese correo" });
            }
            return res.status(500).json({ code: 500, message: "Ocurrió un error al agregar el empleado" });
        }
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

empleados.put("/:id", async (req, res, next) => {
    const { emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion } = req.body;

    if (emp_nombre && emp_apellidos && emp_telefono && emp_correo && emp_direccion) {
        let query = "UPDATE empleados SET emp_nombre = ?, emp_apellidos = ?, emp_telefono = ?, ";
        query += "emp_correo = ?, emp_direccion = ? WHERE emp_id = ?;";
        try {
            const rows = await db.query(query, [emp_nombre, emp_apellidos, emp_telefono, emp_correo, emp_direccion, req.params.id]);
            if (rows.affectedRows == 1) {
                return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
            }
            return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                return res.status(409).json({ code: 409, message: "Ya existe un empleado con ese correo" });
            }
            return res.status(500).json({ code: 500, message: "Ocurrió un error al actualizar el empleado" });
        }
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});

empleados.delete("/:id", async (req, res, next) => {
    const query = "DELETE FROM empleados WHERE emp_id = ?;";
    const rows = await db.query(query, [req.params.id]);

    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Empleado eliminado correctamente" });
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

empleados.get("/", async (req, res, next) => {
    const { nombre } = req.query;
    let rows;

    if (nombre) {
        const query = "SELECT * FROM empleados WHERE CONCAT(emp_nombre, ' ', emp_apellidos) LIKE ?;";
        rows = await db.query(query, [`%${nombre}%`]);
    } else {
        rows = await db.query("SELECT * FROM empleados;");
    }
    return res.status(200).json({ code: 200, message: rows });
});

module.exports = empleados;