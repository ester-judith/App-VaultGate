const express = require("express");
const Router = express.Router();
const mysqlConexion = require("../conexion");
const cron = require('node-cron');

// Endpoint para obtener todos los invitados
Router.get("/", (req, res) => {
    mysqlConexion.query("SELECT * from invitados", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            res.status(500).send("Error en la consulta");
        }
    });
});

// Endpoint para obtener invitados filtrados por nombreU
Router.get("/:nombreU", (req, res) => {
    const nombreU = req.params.nombreU;
    const query = `
        SELECT invitados.*
        FROM invitados
        JOIN usuario ON invitados.nombreU = usuario.nombre
        WHERE usuario.nombre = ?
    `;

    mysqlConexion.query(query, [nombreU], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            res.status(500).send("Error en la consulta");
        }
    });
});

// Endpoint para insertar un nuevo invitado
Router.post("/", (req, res) => {
    const { nombreinv, codigoa, nombreU } = req.body;
    const query = "INSERT INTO invitados (nombreinv, codigoa, nombreU) VALUES (?, ?, ?)";

    mysqlConexion.query(query, [nombreinv, codigoa, nombreU], (err, result) => {
        if (!err) {
            res.send("Invitado agregado exitosamente");
        } else {
            console.log(err);
            res.status(500).send("Error en la inserción");
        }
    });
});

// Endpoint para eliminar un invitado por idinvitado
Router.delete("/:idinvitado", (req, res) => {
    const idinvitado = req.params.idinvitado;
    const query = "DELETE FROM invitados WHERE idinvitado = ?";

    mysqlConexion.query(query, [idinvitado], (err, result) => {
        if (!err) {
            if (result.affectedRows > 0) {
                res.send("Invitado eliminado exitosamente");
            } else {
                res.status(404).send("Invitado no encontrado");
            }
        } else {
            console.log(err);
            res.status(500).send("Error en la eliminación");
        }
    });
});

// Cron job que se ejecuta cada 12 horas para eliminar invitados
cron.schedule('0 */12 * * *', () => {
    const query = "DELETE FROM invitados WHERE created_at < NOW() - INTERVAL 12 HOUR";

    mysqlConexion.query(query, (err, result) => {
        if (err) {
            console.log("Error en la eliminación automática:", err);
        } else {
            console.log("Eliminación automática completada, registros afectados:", result.affectedRows);
        }
    });
});

module.exports = Router;