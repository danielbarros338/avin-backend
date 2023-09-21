import axios from "axios";
import * as Models from "../models/index.js";
import * as cheerio from "cheerio";

export async function getInfo(req, res) {
  const haveSavedData = await _verifyData(req);

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
      message: "Erro ao buscar os dados"
    });
  }

  const $ = cheerio.load(html);
  const tables = $(".w728");
  const infos = {}

  _dataProcessing($, tables, infos);
  const saveStatus = await _saveData(infos);

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

async function _verifyData(req) {
  let dbData;
  try {
    dbData = await Models.Stocks.findAll({ where: { code: req.params.id } });
  } catch (err) {
    return {
      status: 400,
      message: `ERR: SEARCH A STOCK ON DATABASE: ${err.message}`
    };
  }

  if (!dbData || dbData.length === 0)
    return {
      status: 404,
      message: 'DATA NOT FOUND'
    };

  let haveTodayData;
  if (dbData.length > 1) {
    const today = new Date();

    for (const data of dbData) {
      const stockData = new Date(data.createdAt);
      
      if (stockData.toLocaleDateString() === today.toLocaleDateString()) {
        haveTodayData = stockData;
        break;
      }
    }
  }

  if (!haveTodayData) 
    return {
      status: 204,
      message: "NO DATA TODAY"
    };
  
  return {
    status: 200,
    message: haveTodayData
  };
}

async function _saveData(infos) {
  let stock;
  try {
    stock = await Models.Stocks.create({
      code: infos.ResumenData.Papel,
      company: infos.ResumenData.Empresaa
    });
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE STOCK ON DATABASE - ${err.message}`
    }
  }

  try {
    const basicInfoParams = _basicInfoFormater(infos);;

    await Models.BasicInfo.create({
      ...basicInfoParams,
      companyId: stock.id
    });
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE BASIC INFORMATION ON DATABASE - ${err.message}`
    }
  }

  try {
    const oscillationParams = _oscillationFormater(infos);

    await Models.Oscillations.create({
      ...oscillationParams,
      companyId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE OSCILLATION ON DATABASE - ${err.message}`
    }
  }

  return {
    status: 200,
    message: { stockId: stock.id }
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
    subsector: infos.ResumenData.Subsetor
  }
}

function _oscillationFormater(infos) {
  return {
    "2018": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2018"]),
    "2019": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2019"]),
    "2020": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2020"]),
    "2021": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2021"]),
    "2022": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2022"]),
    "2023": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2023"]),
    today: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas.Dia),
    mounth: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas.Ms),
    thirtyDays: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["30Dias"])
  }
}
