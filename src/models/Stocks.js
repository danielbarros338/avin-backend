import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Stocks extends Model { };

Stocks.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "Stocks"
});

export default Stocks;