import FundamentalData from "./../models/FundamentalData.js";

export async function listStock(req, res) {
  const fundamentalData = new FundamentalData(
    process.env.URL,
    process.env.API_KEY,
    "LISTING_STATUS"
  );

  const stockList = await fundamentalData.listStocks();

  res.json({ stockList });
}
