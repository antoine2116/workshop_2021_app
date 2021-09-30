const dbConfig = require('../config/database.js');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    operatorsAliases: false,

    pool: {
        max: dbConfig.POOL.MAX,
        min: dbConfig.POOL.MIN,
        acquire: dbConfig.POOL.ACQUIRE,
        idle: dbConfig.POOL.IDLE
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Référence les tables
db.conteneur = require("../sequelize/models/conteneurs")(sequelize, Sequelize);
db.utilisateur = require("../sequelize/models/users")(sequelize, Sequelize);
db.conteneur_user = require("../sequelize/models/conteneur_user")(sequelize, Sequelize);

db.utilisateur.belongsToMany(db.conteneur, { through: {model : db.conteneur_user, unique: false} });
db.conteneur.belongsToMany(db.utilisateur, { through: {model : db.conteneur_user, unique: false} });

module.exports = db;