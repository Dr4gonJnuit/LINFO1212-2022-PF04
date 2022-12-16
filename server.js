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

// page de l'utilisateur
app.get('/user_page', function (req, res) {
    res.render('user_page.ejs')
});

// page de connection
app.get('/login', function (req, res) {
    res.render('login.ejs')
});

// création du compte
app.post('/newUser', async (req, res) => {

    const user = await dbs.users.findOne({ where: { username: req.body.username } });
    console.log(user);
    const email = await dbs.users.findOne({ where: { email: req.body.email } });
    console.log(email);

    // vérification du nom
    if (user === null) {

        // vérification du mail
        if (email === null) {
            let newUser = await dbs.users.create({ 
                username: req.body.username,
                email: req.body.email,
                pswd: req.body.mdp
            });
            console.log("None error : " + newUser.username);
            req.session.username = req.body.username;
            req.session.notif = "Bienvenue sur notre site " + req.session.username + " !";
            console.log('connected')
            res.redirect('/user_page');
        } else {
            req.session.notif = "L'e-mail que vous avez choisi : '" + req.body.email + "' est déjà Utilisée.";
            console.log('email error');
            res.redirect("/login");
        }
    } else {
        req.session.notif = "Le nom d'utilisateur que vous avez choisi : '" + req.body.fname + "' est déjà pris, veuillez en choisir un nouveau.";
        console.log('name error');
        res.redirect("/login");
    }
});

// connection
app.post('/connection', async (req, res) => {

    const utilisateurConnect = await dbs.users.findOne({ where: { username: req.body.username } });

    if (utilisateurConnect !== null) {
        if (utilisateurConnect.pswd === req.body.pswd) {
            req.session.username = req.body.username;
            res.redirect('user_page');
        } else {
            req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe.";
            res.redirect('/');
        }
    } else {
        req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe.";
        res.redirect('/');
    }
});


// doesn't work I think
app.post('/addCharToUser', async (req, res) => {
    
    const characteristique = await dbs.users.findOne({ where: { chara: req.body.characteristic } });

    if (characteristique === null) {
        let newChara = await dbs.chara.create({
            name: req.body.characteristic
        });
        res.redirect('/login', chara);
    } else {
        req.session.notif = "Vous avez déjà cette charactéristique.";
        res.redirect('/user_page');
    }
});
//

// page de recherche de partenaire
app.get('/recherche', function (req, res) {
    res.render('recherche.ejs')
});

// lancement du server
https.createServer({
    key: fs.readFileSync(__dirname + '/static/key/key.pem'),
    cert: fs.readFileSync(__dirname + '/static/key/cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);
console.log('Server connected\nGo to https://localhost:8080');