import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class IncomeStatementData extends Model { };

IncomeStatementData.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  resultFinancialIntermediation: {
    type: DataTypes.DOUBLE,
  },
  serviceRevenue: {
    type: DataTypes.DOUBLE
  },
  netProfit: {
    type: DataTypes.DOUBLE
  }
}, {
  sequelize,
  modelName: "IncomeStatementData"
});

export default IncomeStatementData;