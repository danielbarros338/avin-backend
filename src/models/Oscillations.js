import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Oscillations extends Model { };

Oscillations.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  "2018": {
    type: DataTypes.DOUBLE,
  },
  "2019": {
    type: DataTypes.DOUBLE
  },
  "2020": {
    type: DataTypes.DOUBLE
  },
  "2021": {
    type: DataTypes.DOUBLE,
  },
  "2022": {
    type: DataTypes.DOUBLE
  },
  "2023": {
    type: DataTypes.DOUBLE
  },
  today: {
    type: DataTypes.DOUBLE
  },
  mounth: {
    type: DataTypes.DOUBLE
  },
  thirtyDays: {
    type: DataTypes.DOUBLE
  },
}, {
  sequelize,
  modelName: "Oscillations"
});

export default Oscillations;