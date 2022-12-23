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

const bcrypt = require('bcrypt');

// mise en place
app.set('view engine', 'ejs');
app.set('views', __dirname + '/static');
app.use(express.static(__dirname + "/static"));

// chargement de la base de données 
const dbs = require("./database.js");
const { Op } = require("sequelize");

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

    if (req.session.username) {
        res.render('user_page.ejs', {
            logine: req.session.username,
            connecte: 'Se déconnecter'
        });
    } else {
        res.render('home.ejs', {
            logine: "Bienvenue sur notre site"
        });
    }
});

// page de l'utilisateur
app.get('/user_page', async (req, res) => {
    
    if (req.session.username) {

        let listContacts = await dbs.contacts.findAll({ where: { name: req.session.username } });

        res.render('user_page.ejs', {
            logine: req.session.username,
            connecte: 'Se déconnecter',
            listContacts: listContacts
        });
    } else {
        res.render('home.ejs');
    }
});

app.get('/message', function (req, res) {

    res.render('message', {
        logine: req.session.username,
        cont: req.session.contact,
        connecte: 'Se déconnecter',
        listmessages3: req.session.listmsg
    });
});

app.post('/write', async (req, res) => {

    req.session.contact = req.body.contacts;
    let listmessages1 = await dbs.messages.findAll({ where: { from_send: req.session.username, to_send: req.body.contacts } });
    let listmessages2 = await dbs.messages.findAll({ where: { from_send: req.body.contacts, to_send: req.session.username } });
    let listmessages3 = listmessages1.concat(listmessages2);
    listmessages3 = listmessages3.sort((a,b) => a.createdAt - b.createdAt);
    req.session.listmsg = listmessages3;

    res.redirect('/message');
});

app.post('/sendmsg', async (req, res) => {

    try {
        let newMsg = await dbs.messages.create({
            from_send: req.session.username,
            msg: req.body.msg,
            snd_time: new Date("05 October 2011 14:48 UTC").toISOString(),
            to_send: req.session.contact
        });
        console.log("None error : " + newMsg.msg);
        req.session.listmsg.push(newMsg);
    } catch(e) {
        console.log(e);
        console.log(req.session.contact);
    }

    res.redirect('/message');
});

// page de connection
app.get('/login', async (req, res) => {

    let connected = req.session.username;

    if (connected) {
        const chara = await dbs.users.findOne({ where: { username: connected } });
        const listChara = await dbs.char.findAll();
        res.render('login.ejs', {chara: chara.chara, listChara: listChara});
    } else {
        res.render('login.ejs', {chara: null, listChara: []});
    }
});

// création du compte
app.post('/newUser', async (req, res) => {

    const user = await dbs.users.findOne({ where: { username: req.body.username } });
    req.session.UserDB = user;
    console.log(user);
    const email = await dbs.users.findOne({ where: { email: req.body.email } });
    console.log(email);

    // vérification du nom
    if (user === null) {

        // vérification du mail
        if (email === null) {
            if (req.body.mdp === req.body.mdpCopy) {
                // hash du mdp
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.mdp, salt, async(err, hash) => {
                        let newUser = await dbs.users.create({ 
                            username: req.body.username,
                            email: req.body.email,
                            pswd: hash
                        });
                    });
                });

                req.session.username = req.body.username;
                req.session.notif = "Bienvenue sur notre site " + req.session.username + " !";
                console.log('connected');
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

        bcrypt.compare(req.body.mdp, user.pswd, function(err, result) {
            if (result) {
                req.session.UserDB = user;
                req.session.username = req.body.username;
                res.redirect('/user_page');
            } else {
                console.log("Nom d'utilisateur inexistant ou mauvais mot de passe. 1");
                req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe. ";
                res.redirect('/');
            }
        });
        
    } else {
        console.log("Nom d'utilisateur inexistant ou mauvais mot de passe. 2");
        req.session.notif = "Nom d'utilisateur inexistant ou mauvais mot de passe. ";
        res.redirect('/');
    }
});

app.post('/addChar', async (req, res) => {

    const listChara = await dbs.char.findOne({ where: { name: req.body.newChara } });

    if (!listChara) {
        let chara = await dbs.char.create({
            name: req.body.newChara
        });
    }

    res.redirect('/login');
})

app.post('/addCharToUser', async (req, res) => {
    
    const characteristiqueUser = await dbs.users.findOne({ where: { username: req.session.username } });
    const characteristique = await dbs.char.findOne({ where: { name: req.body.characteristic } });

    console.log(req.body.characteristic);

    let verif = true;
    let arrChar = [];

    console.log("Usr chara" + characteristiqueUser.chara);

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
        arrChar.sort();

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

// page de recherche de partenaire
app.get('/recherche', function (req, res) {

    if (req.session.username) {
        res.render('recherche.ejs', {
            logine: req.session.username,
            connecte : 'Se déconnecter',
            arrayOfPartLisi: null
        });
    } else {
        res.render('home.ejs');
    }
});

app.post('/rechPart', async (req, res) => {

    let arrPotenCont = [];
    let numberOfChara = req.body.number;

    const user = await dbs.users.findOne({ where: { username: req.session.username } });

    const allUser = await dbs.users.findAll({
        where: {
            [Op.not] : [
                { username: req.session.username }
            ]
        }
    });

    if (!(allUser === null)) { 
        for (const userPot of allUser) {

            if (userPot.chara === null && numberOfChara === "0") { 
                arrPotenCont.push(userPot);
                continue;
            } else if (userPot.chara === null) {
                continue;
            }

            let incr = 0;
            for (const chara of userPot.chara) {
                for (const charaUser of user.chara) {
                    if (chara === charaUser) {
                        incr++;
                    }
                }
                if (numberOfChara <= incr && !arrPotenCont.includes(userPot)) {                    
                    arrPotenCont.push(userPot);
                }
            }
        }
    }

    let arrayOfPartLisi = [];
    for (const part of arrPotenCont) {
        arrayOfPartLisi.push(["N," + part.username, "C," + part.chara]);
    }

    console.log(arrayOfPartLisi);
    
    res.render('recherche.ejs', {
        logine: req.session.username,
        connecte : 'Se déconnecter',
        arrayOfPartLisi: arrayOfPartLisi
    });
    
});

// ajouter un contact
app.post("/ajoutContact", async (req, res) => {

    const nameOfContact = req.body.PotPart;

    try {
        let iferror = nameOfContact.join(',');

        for (const nameC of nameOfContact) {

            console.log(nameC);
    
            let contact = await dbs.users.findOne({ where: { username: nameC } })
    
            console.log(contact.username);
    
            console.log(req.session.username);
            
            let newContact = await dbs.contacts.create({
                name: req.session.username,
                known: contact.username
            });
        }
    } catch (error) {
        let newContact = await dbs.contacts.create({
            name: req.session.username,
            known: nameOfContact
        });
    }
    
    res.redirect('user_page');
});

// Se déconnecter
app.get("/disconnect", function(req, res) {

    if (req.session.username === undefined) {
        req.session.notif = "Connectez vous";
        res.redirect('/login');
    } else {
        req.session.username = undefined;
        req.session.notif = "Merci de votre visite !";
        res.redirect("/");
    }
})

// lancement du server
https.createServer({
    key: fs.readFileSync(__dirname + '/static/key/key.pem'),
    cert: fs.readFileSync(__dirname + '/static/key/cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);
console.log('Server connected\nGo to https://localhost:8080');