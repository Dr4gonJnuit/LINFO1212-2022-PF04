const { name } = require('ejs');
const {Sequelize, DataTypes, Model} = require('sequelize');
var db = {};

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database/projetfinal.sqlite"
});

class User extends Model{};

class Contact extends Model{};

class Message extends Model{};

User.init({
    username: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    email: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    pswd: {
        type: DataTypes.TEXT,
        allowNull: false
    }
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
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
    },
    known: {
        type: DataTypes.TEXT,
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
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
    },
    msg: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    snd_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    to_send: {
        type: DataTypes.TEXT,
        references: {
            model: Contact,
            key: 'known'
        }
    }
}, {
    sequelize,
    modelName: 'Messages'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = User;

db.sequelize.sync({force: true});  

module.exports = db;