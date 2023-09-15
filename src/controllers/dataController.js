import axios from "axios";
import * as cheerio from "cheerio";

export async function getInfo(req, res) {
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
        haveTitle = strTemp.replace(/[^\w\s]/gi, '');
      } else if (Array.isArray(haveTitle)) {
        strTemp = strTemp.replace(/[^\w\s]/gi, '');;

        haveTitle.push(strTemp);
      } else {
        strTemp = strTemp.replace(/[^\w\s]/gi, '');

        haveTitle = [haveTitle, strTemp = strTemp.replace(/[^\w\s]/gi, '')]
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