import axios from "axios";
import * as Models from "../models/index.js";
import * as cheerio from "cheerio";

export async function getInfo(req, res) {
  const haveSavedData = await _verifyData(req, res);

  let html;
  try {
    const response = await axios(process.env.URL + req.params.id, { responseType: 'arraybuffer' });
    html = Buffer.from(response.data, 'binary').toString("latin1");  // Trás o html com a acentuação latina e sem a substituição de caracteres
  } catch (err) {
    res.json({
      err: 400,
      message: "Erro ao buscar os dados"
    });
  }

  const $ = cheerio.load(html);
  const tables = $(".w728");
  const infos = {}

  _dataProcessing($, tables, infos);
  await _saveData(infos, res);

  res.json({ infos });
}

function _dataProcessing($, tables, infos) {
  tables.each(function (i) {
    const labels = $(this).find("tbody tr .label span");
    const values = $(this).find("tbody tr .data span");
    const title = $(this).find("tbody tr .nivel1 span");
    const tableDataArr = [];
    const tableObj = {}

    labels.each(function () {
      const label = $(this).text().replace(/\uFFFD/gi, "");

      if (label !== "?") {
        let formatedLabel = label.replace(/[^\w\s]/gi, '');
        formatedLabel = formatedLabel.trim().split(" ");
        formatedLabel = formatedLabel.map(str => str.charAt(0).toUpperCase() + str.substring(1));
        formatedLabel = formatedLabel.join("");

        tableDataArr.push({
          label: formatedLabel,
          value: null
        });
      }
    });

    values.each(function (i) {
      const value = $(this).text().replace(/\uFFFD/gi, "");

      if (value !== "?") {
        tableDataArr[i].value = value;
      }
    });
    
    let haveTitle;
    title.each(function () {
      let strTemp = $(this).text().replace(/\uFFFD/gi, "").split(" ");
      strTemp = strTemp.map(str => {
        const firtChar = str.charAt(0).toUpperCase();

        return firtChar + str.slice(1);
      });

      strTemp = strTemp.join("");

      if (haveTitle === undefined) {
        haveTitle = strTemp.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      } else if (Array.isArray(haveTitle)) {
        strTemp = strTemp.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        haveTitle.push(strTemp);
      } else {
        strTemp = strTemp.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        haveTitle = [haveTitle, strTemp = strTemp.normalize('NFD').replace(/[\u0300-\u036f]/g, "")]
      }
    });

    for (const data of tableDataArr) {
      if (!data.label) {
        data.label = "emptyLabel";
      }

      tableObj[data.label] = data.value;
    }

    for (const data of tableDataArr) {
      tableObj[data.label] = data.value;
    }

    if (haveTitle === undefined) {
      infos["ResumenData"] = { ...infos["ResumenData"], ...tableObj };
      
      delete infos["ResumenData"]["emptyLabel"]
    } else if (Array.isArray(haveTitle)) { 
      infos[haveTitle.join("_")] = tableObj;

      delete infos[haveTitle.join("_")]["emptyLabel"];
    } else {
      infos[haveTitle] = tableObj;

      delete infos[haveTitle]["emptyLabel"];
    }
  });
}

async function _verifyData(req, res) {
  let dbData;
  try {
    dbData = await Models.Stocks.findAll({ where: { code: req.params.id } });
  } catch (err) {
    // res.json({
    //   err: 400,
    //   message: "Erro ao buscar os dados no banco de dados"
    // });
    throw new Error("Erro ao buscar os dados no banco de dados: ", err.message);
  }

  if (!dbData) return false;

  return true;
}

async function _saveData(infos, res) {
  try {
    const stock = await Models.Stocks.create({
      code: infos.ResumenData.Papel,
      company: infos.ResumenData.Empresa
    });

    const basicInfoParams = _basicInfoFormater(infos);;

    await Models.BasicInfo.create({
      ...basicInfoParams
    });
  } catch (err) {
    // res.json({
    //   err: 400,
    //   message: "Erro ao salvar os dados no banco de dados"
    // });
    throw new Error("Erro ao salvar os dados no banco de dados: ", err);
  }
}

function _basicInfoFormater(infos) {
  const numbers = {
    price: parseFloat(infos.ResumenData.Cotao.replace(",", ".")),
    lowestQuoteTwelveMonths: parseFloat(infos.ResumenData.Min52Sem.replace(",", ".")),
    higherQuoteTwelveMonths: parseFloat(infos.ResumenData.Max52Sem.replace(",", ".")),
    averangeTradingVolumeTwoMonths: parseFloat(infos.ResumenData.VolMd2m.replaceAll(".", "").replace(",",".")),
    marketValue: parseFloat(infos.ResumenData.ValorDeMercado.replaceAll(".", "").replace(",", ".")),
    firmValue: parseFloat(infos.ResumenData.ValorDaFirma.replaceAll(".","").replace(",",".")),
    numberOfActions: parseInt(infos.ResumenData.NroAes.replaceAll(".","")),
  }

  const keys = Object.keys(numbers);

  for (const key of keys) {
    if (isNaN(numbers[key]))
      numbers[key] = null;
  }

  const lastQuoteDate = infos.ResumenData.DataLtCot.split("/").reverse().join("-");
  const lastBalance = infos.ResumenData.LtBalanoProcessado.split("/").reverse().join("-");

  return {
    ...numbers,
    lastQuoteDate,
    lastBalance,
    type: infos.ResumenData.Tipo,
    sector: infos.ResumenData.Setor,
    Subsector: infos.ResumenData.Subsetor
  }
}
