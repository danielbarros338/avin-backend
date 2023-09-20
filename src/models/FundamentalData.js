import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class FundamentalData extends Model { };

FundamentalData.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  P_L: {
    type: DataTypes.DOUBLE,
  },
  LPA: {
    type: DataTypes.DOUBLE
  },
  P_VP: {
    type: DataTypes.DOUBLE
  },
  VPA: {
    type: DataTypes.DOUBLE,
  },
  P_EBIT: {
    type: DataTypes.DOUBLE
  },
  grossMargin: {
    type: DataTypes.DOUBLE
  },
  PSR: {
    type: DataTypes.DOUBLE
  },
  grossEBIT: {
    type: DataTypes.DOUBLE
  },
  P_ASSETS: {
    type: DataTypes.DOUBLE
  },
  netMargin: {
    type: DataTypes.DOUBLE
  },
  P_workingCapital: {
    type: DataTypes.DOUBLE
  },
  EBIT_assets: {
    type: DataTypes.DOUBLE
  },
  P_netCircularAsset: {
    type: DataTypes.DOUBLE
  },
  ROIC: {
    type: DataTypes.DOUBLE
  },
  dividendYeld: {
    type: DataTypes.DOUBLE
  },
  ROE: {
    type: DataTypes.DOUBLE
  },
  EV_EBITDA: {
    type: DataTypes.DOUBLE
  },
  currentLiq: {
    type: DataTypes.DOUBLE
  },
  EV_EBIT: {
    type: DataTypes.DOUBLE
  },
  grossDebit_patrimony: {
    type: DataTypes.DOUBLE
  },
  netRevenueGrow: {
    type: DataTypes.DOUBLE
  },
  assetTurnover: {
    type: DataTypes.DOUBLE
  }
}, {
  sequelize,
  modelName: "FundamentalData"
});

export default FundamentalData;