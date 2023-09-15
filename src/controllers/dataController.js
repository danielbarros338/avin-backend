import axios from "axios";
import * as cheerio from "cheerio";

export async function getInfo(req, res) {
  let html;
  try {
    const response = await axios(process.env.URL + req.params.id);
    html = response.data;
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
    const tableData = [];

    labels.each(function () {
      const label = $(this).text().replace(/\uFFFD/gi, "");

      if (label !== "?") {
        tableData.push({ label, value: null });
      }
    });

    values.each(function (i) {
      const value = $(this).text().replace(/\uFFFD/gi, "");

      if (value !== "?") {
        tableData[i].value = value;
      }
    });

    if (i === 0) {
      infos["ResumenData"] = tableData;
    } else if (i === 1) {
      infos["ResumenData"] = [...infos["ResumenData"], ...tableData];
    } else {
      let haveTitle;
      title.each(function () {
        haveTitle = $(this).text().replace(/\uFFFD/gi, "").split(" ");
        haveTitle = haveTitle.map(str => {
          const firtChar = str.charAt(0).toUpperCase();

          return firtChar + str.slice(1);
        });

        haveTitle = haveTitle.join("");
      })

      infos[haveTitle] = tableData;
    }
  });
}