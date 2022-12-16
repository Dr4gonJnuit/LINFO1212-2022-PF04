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
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: User,
            key: 'username'
        }
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

db.chara = Characteristique;

db.sequelize.sync({force: true});  

module.exports = db;