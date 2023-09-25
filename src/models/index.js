import Stocks from "./Stocks.js";
import BasicInfo from "./BasicInfos.js";
import Oscillations from "./Oscillations.js";
import SheetBalance from "./SheetBalance.js";
import IncomeStatementData from "./IncomeStatementData.js";
import FundamentalData from "./FundamentalData.js";

Stocks.hasMany(BasicInfo);
Stocks.hasMany(Oscillations);
Stocks.hasMany(SheetBalance);
Stocks.hasMany(IncomeStatementData);
Stocks.hasMany(FundamentalData);

// Stocks.sync({ force: true });

BasicInfo.belongsTo(Stocks);
Oscillations.belongsTo(Stocks);
SheetBalance.belongsTo(Stocks);
IncomeStatementData.belongsTo(Stocks);
FundamentalData.belongsTo(Stocks);

// BasicInfo.sync({ force: true });
// Oscillations.sync({ force: true });
// SheetBalance.sync({ force: true });
// IncomeStatementData.sync({ force: true });
// FundamentalData.sync({ force: true });

export { Stocks, BasicInfo, Oscillations, SheetBalance, IncomeStatementData, FundamentalData };