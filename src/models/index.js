import Stocks from "./Stocks";
import BasicInfo from "./BasicInfos";
import Oscillations from "./Oscillations";
import SheetBalance from "./SheetBalance";
import IncomeStatementData from "./IncomeStatementData";
import FundamentalData from "./FundamentalData";

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

export default { Stocks, BasicInfo };