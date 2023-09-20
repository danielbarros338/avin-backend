import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class BasicInfo extends Model { };

BasicInfo.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  type: {
    type: DataTypes.CHAR(5)
  },
  lastQuoteDate: {
    type: DataTypes.DATE
  },
  lowestQuoteTwelveMonths: {
    type: DataTypes.DOUBLE
  },
  sector: {
    type: DataTypes.STRING
  },
  higherQuoteTwelveMonths: {
    type: DataTypes.DOUBLE
  },
  subsector: {
    type: DataTypes.STRING
  },
  averangeTradingVolumeTwoMonths: {
    type: DataTypes.DOUBLE
  },
  marketValue: {
    type: DataTypes.DOUBLE
  },
  lastBalance: {
    type: DataTypes.DATE
  },
  firmValue: {
    type: DataTypes.DOUBLE
  },
  numberOfActions: {
    type: DataTypes.BIGINT
  },
}, {
  sequelize,
  modelName: "BasicInfos"
});

export default BasicInfo;