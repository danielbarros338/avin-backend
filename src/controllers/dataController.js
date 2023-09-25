import axios from "axios";
import * as cheerio from "cheerio";
import * as databaseOperations from "../utils/databaseOperation.js";
import { stockJSONFormater } from "../utils/formaters.js";

export async function getInfo(req, res) {
  let stock = await databaseOperations.verifyData(req);

  if (stock.status === 200) {
    const data = stockJSONFormater(stock.message.stock);

    res
      .status(stock.status)
      .json(data)
      .end();
    
    return;
  }

  let html;
  try {
    const response = await axios(process.env.URL + req.params.id, { responseType: 'arraybuffer' });
    html = Buffer.from(response.data, 'binary').toString("latin1");  // Trás o html com a acentuação latina e sem a substituição de caracteres
  } catch (err) {
    res.json({
      err: 400,
      message: `ERR: SEARCH DATA - ${err.message}`
    });
  }

  const $ = cheerio.load(html);
  const tables = $(".w728");
  const infos = {}

  databaseOperations.dataProcessing($, tables, infos);
  const saveStatus = await databaseOperations.saveData(infos);
  stock = await databaseOperations.getSavedData(saveStatus.message.stockId);
  stock = stockJSONFormater(stock.message.stock[0]);

  res.json({ stock });
}
