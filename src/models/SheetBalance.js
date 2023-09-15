import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

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
  }
}, {
  sequelize,
  modelName: "SheetBalances"
});

export default SheetBalances;