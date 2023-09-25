import * as formater from "../utils/formaters.js";
import * as Models from "../models/index.js";

export async function saveData(infos) {
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
      StockId: stock.id
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
      StockId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE OSCILLATION ON DATABASE - ${err.message}`
    }
  }

  try {
    const fundamentalDataParams = formater.fundamentalDataFormater(infos);

    await Models.FundamentalData.create({
      ...fundamentalDataParams,
      StockId: stock.id
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
      StockId: stock.id
    })
  } catch (err) {
    return {
      err: 400,
      message: `ERR: SAVE INCOME STATEMENT ON DATABASE - ${err.message}`
    }
  }

  try {
    const sheetBalanceParams = formater.sheetBalanceFormater(infos);

    await Models.SheetBalance.create({
      ...sheetBalanceParams,
      StockId: stock.id
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

export function dataProcessing($, tables, infos) {
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

export async function verifyData(req) {
  let dbData;
  try {
    dbData = await Models.Stocks.findAll({
      where: { code: req.params.id },
      include: [
        { model: Models.FundamentalData },
        { model: Models.IncomeStatementData },
        { model: Models.Oscillations },
        { model: Models.SheetBalance },
        { model: Models.BasicInfo },
      ]
    });
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

  let stock;
  if (dbData.length > 1) {
    const today = new Date();

    for (const data of dbData) {
      const stockData = new Date(data.createdAt);
      
      if (stockData.toLocaleDateString() === today.toLocaleDateString()) {
        stock = data;
        break;
      }
    }
  } else {
    const today = new Date();

    if (dbData[0].createdAt.toLocaleDateString() === today.toLocaleDateString()) {
      stock = dbData[0];
    }
  }

  if (!stock) 
    return {
      status: 204,
      message: "NO DATA TODAY"
    };
  
  return {
    status: 200,
    message: { stock: stock }
  };
}

export async function getSavedData(id) {
  let stock;
  try {
    stock = await Models.Stocks.findAll({
      where: { id },
      include: [
        { model: Models.FundamentalData },
        { model: Models.IncomeStatementData },
        { model: Models.Oscillations },
        { model: Models.SheetBalance },
        { model: Models.BasicInfo },
      ]
    });
  } catch (err) {
    return {
      status: 400,
      message: `ERR: SEARCH A STOCK ON DATABASE: ${err.message}`
    };
  }

  return {
    status: 200,
    message: { stock }
  }
}
