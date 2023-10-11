import Stock from "../models/Stocks.js";

export async function listStock(req, res) {
  const stock = new Stock(
    process.env.URL,
    process.env.API_KEY,
    "LISTING_STATUS"
  );

  const stockList = await stock.listStocks();

  res.status(200).json({ stockList });
}
