import axios from "axios";
import * as cheerio from "cheerio";
import * as Models from "../models/index.js";
import * as formater from "../utils/formaters.js";

export async function getInfo(req, res) {
  const haveSavedData = await _verifyData(req);

  //TO DO: Logica para retornar os dados completos se existir dados salvos hoje

  // if (haveSavedData.status === 200) {
  //   res
  //     .status(haveSavedData.status)
  //     .json(haveSavedData.message)
  //     .end();
    
  //   return;
  // }

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

  _dataProcessing($, tables, infos);
  const saveStatus = await _saveData(infos);

  res.json({ saveStatus });
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
      company: infos.ResumenData.Empresa
    });
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE STOCK ON DATABASE - ${err.message}`
    }
  }

  try {
    const basicInfoParams = formater.basicInfoFormater(infos);;

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
    const oscillationParams = formater.oscillationFormater(infos);

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

  try {
    const fundamentalDataParams = formater.fundamentalDataFormater(infos);

    await Models.Oscillations.create({
      ...fundamentalDataParams,
      companyId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE FUNDAMENTAL DATA ON DATABASE - ${err.message}`
    }
  }

  try {
    const incomeStatementParams = formater.incomeStatementFormater(infos);

    await Models.IncomeStatementData.create({
      ...incomeStatementParams,
      companyId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE INCOME STATEMENT ON DATABASE - ${err.message}`
    }
  }

  try {
    const sheetBalanceParams = formater.sheetBalanceFormater(infos);

    await Models.IncomeStatementData.create({
      ...sheetBalanceParams,
      companyId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE SHEET BALANCE ON DATABASE - ${err.message}`
    }
  }

  return {
    status: 200,
    message: { stockId: stock.id }
  }
}
