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

db.sequelize.sync({force: true});

module.exports = db;