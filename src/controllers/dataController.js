import axios from "axios";
import * as cheerio from "cheerio";
import * as databaseOperations from "../utils/databaseOperation.js";

export async function getInfo(req, res) {
  const haveSavedData = await databaseOperations.verifyData(req);

  //TO DO: Logica para retornar os dados completos se existir dados salvos hoje

  if (haveSavedData.status === 200) {
    res
      .status(haveSavedData.status)
      .json(haveSavedData.message)
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

  res.json({ saveStatus });
}
