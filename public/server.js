const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'devconnectdb',
    database: process.env.DB_PORT || '3306'
});


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res) {
    res.render('create-account');
});

app.post('/create-account', function(req, res) {
    const { email, username, password, userType } = req.body;

    if (!email || !username || !password || !userType) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO users (email, username, password, userType) VALUES (?, ?, ?, ?)';
    db.query(query, [email, username, password, userType], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err); // Mostrar el error en la consola para depuración
            return res.status(500).send('Error al crear la cuenta');
        }
        res.redirect('/inicio_sesion.html');
    });
});

app.get('/inicio_sesion.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inicio_sesion.html'));
});

app.get('/forgotten-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forgotten-password.html'));
});


// Iniciar el servidor en el puerto asignado por el entorno o en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
