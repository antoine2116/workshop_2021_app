module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING(80),
            allowNull: false,
            unique: 'compositeIndex'
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
    });

    return User;
}
