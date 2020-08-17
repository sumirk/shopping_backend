const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  count: Sequelize.INTEGER

});

module.exports = CartItem;
