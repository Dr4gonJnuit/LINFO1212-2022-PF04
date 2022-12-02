const {Sequelize, DataTypes, Model} = require('sequelize')

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "projetfinal.sqlite"
})

class User extends Model{}
class Message extends Model{}
class Contact extends Model{}

User.init({
    email: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    pswd: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    account: {
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: Account,
            key: email
        }
    }
})

Message.init({
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: User,
            key: username
        }
    },
    msg: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    snd_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

/*
à améliorer

Contact.init({
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: User,
            key: username
        }
    },
    known: {
        type: DataTypes.TEXT,
        primaryKey: true,
        references: {
            model: User,
            key: username
        }
    }
})
*/