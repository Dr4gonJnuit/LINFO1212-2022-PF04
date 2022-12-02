/*
*   note à soi-même, si besoin de faire un changement dans le serveur,
*   pour le relancer plus facilement, faire ctrl + c
*/

// chargement des prérequis
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
var https = require('https');
var fs = require('fs');

// mise en place
app.set('view engine', 'ejs');
app.set('views', __dirname + '/static');
app.use(express.static(__dirname + "/static"));

// chargement de la base de données 
const dbs = require(__dirname + "/database.js");

// test de la connection à la DB
try {
    dbs.sequelize.authenticate();
    console.log('La connection à la DB a été correctement établie.');
} catch (error) {
    console.error('La connection à la DB n\'a pas pu être correctement établie :', error);
}

// chargement et utilisation des sessions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "JonasThomasChristos",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
    }
}));

// page principale
app.get('/', function (req, res) {
    res.render('home.ejs')
});

// lancement du server
https.createServer({
    key: fs.readFileSync(__dirname + '/static/key/key.pem'),
    cert: fs.readFileSync(__dirname + '/static/key/cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);
console.log('Server connected');
console.log('Go to https://localhost:8080');

console.log('bonbjour');