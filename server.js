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
//const Bcrypt = require("bcryptjs");  --> Ne fonctionne pas

// mise en place
app.set('view engine', 'ejs');
app.set('views', __dirname + '/static');
app.use(express.static(__dirname + "/static"));

// chargement de la base de données 
const dbs = require("./database.js");

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
    if(req.session.username){
        res.render('user_page',{
            logine: req.session.username,
            connecte : 'Se déconnecter'
        })}
    else{
        res.render('home', {
            logine: "Bienvenue sur notre site"
        })
    }
});

// page de l'utilisateur
app.get('/user_page', async (req, res) => {
    if(req.session.username){
        let listContacts = await dbs.contacts.findAll({where : {id : req.session.username}})


        res.render('user_page.ejs',{
            logine: req.session.username,
            connecte : 'Se déconnecter',
            listContacts : listContacts
        })}
    else{
        res.render('home')
    }
});

// page de connection
app.get('/login', async (req, res) => {

    let connected = req.session.username;
    if (connected) {
        const chara = await dbs.users.findOne({ where: { username: connected } });
        res.render('login.ejs', {chara: chara.chara});
    } else {
        res.render('login.ejs', {chara: '[]'});
    }
    
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
            if (req.body.mdp === req.body.mdpCopy){
                let newUser = await dbs.users.create({ 
                    username: req.body.username,
                    email: req.body.email,
                    pswd: req.body.mdp,
                });
                console.log("None error : " + newUser.username);
                req.session.username = req.body.username;
                req.session.notif = "Bienvenue sur notre site " + req.session.username + " !";
                console.log('connected')
                res.redirect('/user_page');
            } else {
                req.session.notif = "Les deux mots de passe ne correspondent pas";
                console.log('password error');
                res.redirect("/login"); 
            }
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

    let user = await dbs.users.findOne({ where: { username: req.body.username } });

    if (user !== null) {
        if (user.pswd === req.body.mdp) {
            req.session.username = req.body.username;
            res.redirect('/user_page');
        } else {
            console.log("Nom d'utilisateur inexistant ou mauvais mot de passe. 1")
            req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe. ";
            res.redirect('/');
        }
    } else {
        console.log("Nom d'utilisateur inexistant ou mauvais mot de passe. 2")
        req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe. ";
        res.redirect('/');
    }
});


// doesn't work for now
app.post('/addCharToUser', async (req, res) => {
    
    const characteristiqueUser = await dbs.users.findOne({ username: { chara: req.session.username } });
    const characteristique = await dbs.char.findOne({ where: { name: req.body.characteristic } });

    console.log(req.body.characteristic);

    let verif = true;
    let arrChar = [];

    console.log(characteristiqueUser.chara);

    if (!(characteristiqueUser.chara === null)) {
        for (const element of characteristiqueUser.chara) {
            if (element === req.body.characteristic) {
                verif = false;
            }
            arrChar.push(element);
            console.log(element);
            console.log(arrChar);
        }
    }

    console.log(arrChar);

    if (verif) {
        if (characteristique === null) {
            let newChara = await dbs.char.create({
                name: req.body.characteristic
            });
            console.log("Insertion d'une nouvelle charactéristique");
        }

        arrChar.push(req.body.characteristic);

        console.log(arrChar);

        let newCharaUser = await dbs.users.update({
            chara: arrChar
        }, { 
            where: { username: req.session.username } 
        });
        res.redirect('/login');
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

// Se déconnecter
app.get("/disconnect", function(req,res){
    if (req.session.username === undefined){
        req.session.notif = "Connectez vous";
        res.redirect('/login');
    } else {
        req.session.username = undefined;
        req.session.notif = "Merci de votre visite !";
        res.redirect("/")
    }
})

// lancement du server
https.createServer({
    key: fs.readFileSync(__dirname + '/static/key/key.pem'),
    cert: fs.readFileSync(__dirname + '/static/key/cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);
console.log('Server connected\nGo to https://localhost:8080');