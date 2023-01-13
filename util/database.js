const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', '12345abhi',{
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;