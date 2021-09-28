module.exports = (sequelize, Sequelize) => {
    const Conteneur = sequelize.define("conteneur", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        libelle: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
        structure: {
            type: Sequelize.JSON,
            allowNull: false
        },
    });

    return Conteneur;
}
