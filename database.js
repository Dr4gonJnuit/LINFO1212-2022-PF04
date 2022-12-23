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
        allowNull: false,
    },
    chara: {
        type: DataTypes.STRING,
        allowNull: true,
        /*
        references: {
            model: Characteristique,
            key: 'name'
        },
        */
        get() {
            const value = this.getDataValue('chara');

            return value ? value.split(',') : null;
        },
        set(val) {
            val ? this.setDataValue('chara', val.join(',')) : null;
        }
    }
}, {
    sequelize,
    modelName: 'Users'
});

Contact.init({
    name: {
        type: DataTypes.STRING
    },
    known: {
        type: DataTypes.STRING
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
        allowNull: false
    },
    to_send: {
        type: DataTypes.STRING,
        allowNull: false
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

db.char = Characteristique;

//db.sequelize.sync({force: true});
/*
(async () => {
    await db.sequelize.sync({ force: true });
  });
*//*
const ca = Characteristique.create({
    name: "Gentil"
});

const ca2 = Characteristique.create({
    name: "Méchant"
});

const eltcheetos = User.create({ 
    username: "eltcheetos",
    email: "paizstos11012001@gmail.com",
    pswd: "azerty",
    chara: ["Gentil,Méchant"]
});

const barrel = User.create({ 
    username: "barrel",
    email: "paizstos@gmail.com",
    pswd: "azerty",
    chara: ["Méchant"]
});

const Jojo = User.create({ 
    username: "Jojo",
    email: "test@gmail.com",
    pswd: "test"
});

const Baloo = User.create({
    username: 'Baloo',
    email: 'Baloo@ours.com',
    pswd: 'oursson',
    chara: ["Gentil,Attentionné,Lent"]
})

const contact = Contact.create({
    name: "eltcheetos",
    known: "barrel"
});*/

module.exports = db;