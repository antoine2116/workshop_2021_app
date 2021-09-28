// config/database.js
module.exports = {
    HOST: 'localhost',
    USER: 'ilias',
    PASSWORD: 'mfu08vjv',
    DB: 'workshop',
    DIALECT: 'mysql',
    POOL: {
        MAX: 5,
        MIN: 0,
        ACQUIRE: 30000,
        IDLE: 10000
    }
};
