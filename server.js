const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./conexion");
const usuarios = require("./routes/usuarios");
const invitados = require("./routes/invitados");
const apertura = require("./routes/apertura");
const puertaS = require("./routes/puertaS"); 

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// Rutas de la API
app.use("/usuarios", usuarios);
app.use("/invitados", invitados);
app.use("/apertura", apertura);
app.use("/puertaS", puertaS); // Usa la nueva ruta

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});