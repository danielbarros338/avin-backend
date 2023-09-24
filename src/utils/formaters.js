export function oscillationFormater(infos) {
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

export function basicInfoFormater(infos) {
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
