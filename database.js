var Sequelize = require("sequelize"),
    config = require("./config.json");

exports.context = new Sequelize("Database.db", null, null, {
    dialect: "sqlite",
    storage: config.database,
    logging: false,
    define: {
        timestamps: false
    }
});
exports.Challenges = exports.context.define("Challenges", {
    Id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    Owner: { type: Sequelize.STRING },
    Title: { type: Sequelize.STRING },
    Date: { type: Sequelize.DATE }
});
exports.Challenges.sync();