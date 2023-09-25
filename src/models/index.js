import Stocks from "./Stocks.js";
import BasicInfo from "./BasicInfos.js";
import Oscillations from "./Oscillations.js";
import SheetBalance from "./SheetBalance.js";
import IncomeStatementData from "./IncomeStatementData.js";
import FundamentalData from "./FundamentalData.js";

BasicInfo.belongsTo(Stocks, {
  foreignKey: "companyId"
});

Oscillations.belongsTo(Stocks, {
  foreignKey: "companyId"
});

SheetBalance.belongsTo(Stocks, {
  foreignKey: "companyId"
});

IncomeStatementData.belongsTo(Stocks, {
  foreignKey: "companyId"
});

FundamentalData.belongsTo(Stocks, {
  foreignKey: "companyId"
});

// Stocks.sync();
// BasicInfo.sync({ force: true });
// Oscillations.sync();
// SheetBalance.sync({ force: true });
// IncomeStatementData.sync({ force: true });
// FundamentalData.sync();

export { Stocks, BasicInfo, Oscillations, SheetBalance, IncomeStatementData, FundamentalData };