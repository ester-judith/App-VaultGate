const express = require("express");
const Router = express.Router();
const mysqlConexion = require("../conexion");

// Método GET
Router.get("/", (req, res) => {
    mysqlConexion.query("SELECT * from usuario", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

// Método POST
Router.post("/", (req, res) => {
    const { idusuario, nombre, correo, contrasena } = req.body;
    const query = `
        INSERT INTO usuario (idusuario, nombre, correo, contrasena) 
        VALUES (?, ?, ?, ?)
    `;

    mysqlConexion.query(query, [idusuario, nombre, correo, contrasena], (err, results, fields) => {
        if (!err) {
            res.status(201).json({ message: "Usuario creado", id: results.insertId });
        } else {
            console.log(err);
            res.status(500).json({ error: "Error al crear el usuario" });
        }
    });
});

// POST /usuarios/login
Router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    mysqlConexion.query(
        'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
        [correo, contrasena],
        (err, rows, fields) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.status(500).json({ success: false, message: 'Error al iniciar sesión. Por favor, intenta de nuevo más tarde.' });
            }

            if (rows.length > 0) {
                // Usuario encontrado, enviar datos del usuario
                const usuario = rows[0]; // Suponiendo que solo hay un usuario con ese correo y contraseña
                res.json({
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    usuario: {
                        idusuario: usuario.idusuario,
                        nombre: usuario.nombre,
                        correo: usuario.correo
                        // Puedes incluir otros campos del usuario si los necesitas
                    }
                });
            } else {
                // Usuario no encontrado o credenciales incorrectas
                res.status(401).json({ success: false, message: 'Correo electrónico o contraseña incorrectos' });
            }
        }
    );
});

module.exports = Router;