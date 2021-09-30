module.exports = (sequelize, Sequelize) => {
    const Conteneur = sequelize.define("conteneur", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING(80),
            allowNull: false
        }
    });

    return Conteneur;
}
