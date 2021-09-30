module.exports = (sequelize, Sequelize) => {
    const ConteneurUser = sequelize.define("conteneur_user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nom: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
        domaine: {
            type: Sequelize.STRING(80),
            allowNull: true
        },
        version: {
            type: Sequelize.STRING(80),
            allowNull: true
        },
        port: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        userftp: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        mdpftp: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },{ timestamps: true });

    return ConteneurUser;
}
