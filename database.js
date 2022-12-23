const { name } = require('ejs');
const {Sequelize, DataTypes, Model} = require('sequelize');
var db = {};

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database/projetfinal.sqlite"
});

class Characteristique extends Model{};

class User extends Model{};

class Contact extends Model{};

class Message extends Model{};

Characteristique.init({
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    sequelize,
    modelName: 'Characteristiques'
});

User.init({
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    pswd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chara: [{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [""],
        references: {
            model: Characteristique,
            key: 'name'
        }
    }]
}, {
    sequelize,
    modelName: 'Users'
});

/*
* faire attention au morceau de la base ci-dessous
* changement possible !!
*/
Contact.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
    },
    known: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
    }
}, {
    sequelize,
    modelName: 'Contacts'
});

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        //references: {
          //  model: User,
            //key: 'username'
        //}
    },
    from_send: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    msg: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   snd_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    to_send: {
        type: DataTypes.STRING,
        allowNull: false
        //references: {
          //  model: User,
            //key: 'username'
        //}
    }
}, {
    sequelize,
    modelName: 'Messages'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = User;
db.contacts = Contact;
db.messages = Message; 

db.chara = Characteristique;

//db.sequelize.sync({force: true});

(async () => {
    await db.sequelize.sync({ force: true });
  });

const eltcheetos = User.create({ 
    username: "eltcheetos",
    email: "paizstos11012001@gmail.com",
    pswd: "azerty",
    chara: "Gentil"
});

console.log(eltcheetos.name);

const barrel = User.create({ 
    username: "barrel",
    email: "paizstos@gmail.com",
    pswd: "azerty",
    chara: "Gentil"
});

const contact = Contact.create({
    id: "eltcheetos",
    known: "barrel"
});

const contact2 = Contact.create({
    id: "barrel",
    known: "eltcheetos"
});

const message1 = Message.create({
    from_send: "barrel",
    msg: "Hi, it's barrel",
    snd_time: 2022-12-01,
    to_send:"eltcheetos"
});


  

module.exports = db;