import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Stocks extends Model { };

Stocks.init({
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "Stocks"
});

export default Stocks;