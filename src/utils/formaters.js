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

  return {
    ...numbers,
    lastQuoteDate: infos.ResumenData.DataLtCot.split("/").reverse().join("-"),
    lastBalance: infos.ResumenData.LtBalanoProcessado.split("/").reverse().join("-"),
    type: infos.ResumenData.Tipo,
    sector: infos.ResumenData.Setor,
    subsector: infos.ResumenData.Subsetor
  }
}

export function incomeStatementFormater(info) {
  return {
    resultFinancialIntermediation: parseFloat(info.DadosDemonstrativosDeResultados.ResultIntFinanc.replaceAll(".", "").replace(",",".")),
    serviceRevenue: parseFloat(info.DadosDemonstrativosDeResultados.RecServios.replaceAll(".", "").replace(",",".")),
    netProfit: parseFloat(info.DadosDemonstrativosDeResultados.LucroLquido.replaceAll(".", "").replace(",","."))
  }
}

export function sheetBalanceFormater(info) {
  return {
    active: parseFloat(info.DadosBalancoPatrimonial.Ativo.replaceAll(".", "").replace(",",".")),
    deposit: parseFloat(info.DadosBalancoPatrimonial.Depsitos.replaceAll(".", "").replace(",",".")),
    creditCard: parseFloat(info.DadosBalancoPatrimonial.CartDeCrdito.replaceAll(".", "").replace(",",".")),
    netWorth: parseFloat(info.DadosBalancoPatrimonial.PatrimLq.replaceAll(".", "").replace(",","."))
  }
}

export function fundamentalDataFormater(info) {
  const Oscilacoes_IndicadoresFundamentalistas = { ...info.Oscilacoes_IndicadoresFundamentalistas };
  const keysInfo = Object.keys(Oscilacoes_IndicadoresFundamentalistas);

  for (const key of keysInfo) {
    Oscilacoes_IndicadoresFundamentalistas[key] = Oscilacoes_IndicadoresFundamentalistas[key].replaceAll("\n", "");
    Oscilacoes_IndicadoresFundamentalistas[key] = Oscilacoes_IndicadoresFundamentalistas[key].replaceAll("-", "");
    Oscilacoes_IndicadoresFundamentalistas[key] = Oscilacoes_IndicadoresFundamentalistas[key].replaceAll("%", "");
    Oscilacoes_IndicadoresFundamentalistas[key] = Oscilacoes_IndicadoresFundamentalistas[key].replaceAll(".", "");
    Oscilacoes_IndicadoresFundamentalistas[key] = Oscilacoes_IndicadoresFundamentalistas[key].replaceAll(",", ".");
  }

  const params = {
    P_L: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PL),
    LPA: parseFloat(Oscilacoes_IndicadoresFundamentalistas.LPA),
    P_VP: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PVP),
    VPA: parseFloat(Oscilacoes_IndicadoresFundamentalistas.VPA),
    P_EBIT: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PEBIT),
    grossMargin: parseFloat(Oscilacoes_IndicadoresFundamentalistas.MargBruta),
    PSR: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PSR),
    grossEBIT: parseFloat(Oscilacoes_IndicadoresFundamentalistas.MargEBIT),
    P_ASSETS: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PAtivos),
    netMargin: parseFloat(Oscilacoes_IndicadoresFundamentalistas.MargLquida),
    P_workingCapital: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PCapGiro),
    EBIT_assets: parseFloat(Oscilacoes_IndicadoresFundamentalistas.EBITAtivo),
    P_netCircularAsset: parseFloat(Oscilacoes_IndicadoresFundamentalistas.PAtivCircLiq),
    ROIC: parseFloat(Oscilacoes_IndicadoresFundamentalistas.ROIC),
    dividendYeld: parseFloat(Oscilacoes_IndicadoresFundamentalistas.DivYield),
    ROE: parseFloat(Oscilacoes_IndicadoresFundamentalistas.ROE),
    EV_EBITDA: parseFloat(Oscilacoes_IndicadoresFundamentalistas.EVEBITDA),
    currentLiq: parseFloat(Oscilacoes_IndicadoresFundamentalistas.LiquidezCorr),
    EV_EBIT: parseFloat(Oscilacoes_IndicadoresFundamentalistas.EVEBIT),
    grossDebit_patrimony: parseFloat(Oscilacoes_IndicadoresFundamentalistas.DivBrPatrim),
    netRevenueGrow: parseFloat(Oscilacoes_IndicadoresFundamentalistas.CresRec5a),
    assetTurnover: parseFloat(Oscilacoes_IndicadoresFundamentalistas.GiroAtivos),
  }

  const keysParams = Object.keys(params);
  for (const key of keysParams) {
    if (isNaN(params[key]))
      params[key] = null
  }

  return params;
}
