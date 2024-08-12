const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10, // Número máximo de conexiones en el pool
    host: "oaxacapower.org",
    user: "u744130986_VaultGate",
    password: "BXueQ@vEB;g1",
    database: "u744130986_VaultGate",
    multipleStatements: true,
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) 
        {connection.release();
        console.log("Estas conectado a la BD MYSQL");
    }
    return;
});

module.exports = pool;