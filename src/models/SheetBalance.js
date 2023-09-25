import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class SheetBalances extends Model { };

SheetBalances.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  active: {
    type: DataTypes.DOUBLE,
  },
  deposit: {
    type: DataTypes.DOUBLE
  },
  creditCard: {
    type: DataTypes.DOUBLE
  },
  netWorth: {
    type: DataTypes.DOUBLE,
  },
  currentAssets: {
    type: DataTypes.DOUBLE
  },
  disponibilities: {
    type: DataTypes.DOUBLE
  },
  grossDebit: {
    type: DataTypes.DOUBLE
  },
  netDebit: {
    type: DataTypes.DOUBLE
  }
}, {
  sequelize,
  modelName: "SheetBalances"
});

export default SheetBalances;