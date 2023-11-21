import Stock from "../models/Stocks.js";
import FundamentalData from "../models/FundamentalData.js";

export async function listStock(req, res) {
  const stock = new Stock(
    process.env.URL,
    process.env.API_KEY,
    "LISTING_STATUS"
  );

  const stockList = await stock.listStocks();

  res.status(200).json({ stockList });
}

export async function companyOverview(req, res) {
  const fundamentalData = new FundamentalData(
    process.env.URL,
    process.env.API_KEY,
    "OVERVIEW",
    req.body.symbol
  );

  const companyOverview = await fundamentalData.companyOverview();

  res.status(200).json({ companyOverview });
}
