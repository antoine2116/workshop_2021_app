module.exports = (sequelize, Sequelize) => {
    const ConteneurUser = sequelize.define("conteneur_user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        libelle: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
        params: {
            type: Sequelize.JSON,
            allowNull: false
        },
    },{ timestamps: true });

    return ConteneurUser;
}
