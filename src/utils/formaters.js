export function oscillationFormater(infos) {
  return {
    "2018": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2018"].replaceAll(".", "").replace(",",".")),
    "2019": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2019"].replaceAll(".", "").replace(",",".")),
    "2020": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2020"].replaceAll(".", "").replace(",",".")),
    "2021": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2021"].replaceAll(".", "").replace(",",".")),
    "2022": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2022"].replaceAll(".", "").replace(",",".")),
    "2023": parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["2023"].replaceAll(".", "").replace(",",".")),
    today: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas.Dia.replaceAll(".", "").replace(",",".")),
    mounth: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas.Ms.replaceAll(".", "").replace(",",".")),
    thirtyDays: parseFloat(infos.Oscilacoes_IndicadoresFundamentalistas["30Dias"].replaceAll(".", "").replace(",","."))
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
  const keys = Object.keys(info.DadosDemonstrativosDeResultados);
  const expectedKeys = ["ResultIntFinanc", "RecServios", "LucroLquido", "ResultIntFinanc", "ReceitaLquida", "EBIT"];
  const intermediateParams = {}

  for (const expectedKey of expectedKeys) {
    for (const key of keys) {
      if (key === expectedKey) {
        intermediateParams[key] = parseFloat(info.DadosDemonstrativosDeResultados[key].replaceAll(".", "").replace(",","."));
      } else if (!intermediateParams[expectedKey]) {
        intermediateParams[expectedKey] = null;
      }
    }
  }

  const params = {
    resultFinancialIntermediation: intermediateParams.ResultIntFinanc,
    serviceRevenue: intermediateParams.RecServios,
    netProfit: intermediateParams.LucroLquido,
    netRevenue: intermediateParams.ReceitaLquida,
    EBIT: intermediateParams.EBIT
  }

  return params;
}

export function sheetBalanceFormater(info) {
  const keys = Object.keys(info.DadosBalancoPatrimonial);
  const expectedKeys = ["Ativo", "Depsitos", "CartDeCrdito", "PatrimLq", "AtivoCirculante", "Disponibilidades", "DvBruta", "DvLquida"];
  const intermediateParams = {}

  for (const expectedKey of expectedKeys) {
    for (const key of keys) {
      if (key === expectedKey) {
        intermediateParams[key] = parseFloat(info.DadosBalancoPatrimonial[key].replaceAll(".", "").replace(",","."));
      } else if (!intermediateParams[expectedKey]) {
        intermediateParams[expectedKey] = null;
      }
    }
  }

  return {
    active: intermediateParams.Ativo,
    deposit: intermediateParams.Depsitos,
    creditCard: intermediateParams.CartDeCrdito,
    netWorth: intermediateParams.PatrimLq,
    currentAssets: intermediateParams.AtivoCirculante,
    disponibilities: intermediateParams.Disponibilidades,
    grossDebit: intermediateParams.DvBruta,
    netDebit: intermediateParams.DvLquida
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

export function stockJSONFormater(stock) {
  // return stock;
  return {
    BasicInfo: {
      code: stock.code,
      company: stock.company,
      price: stock.BasicInfos[0].price,
      type: stock.BasicInfos[0].type,
      lastQuoteDate: stock.BasicInfos[0].lastQuoteDate,
      lowestQuoteTwelveMonths: stock.BasicInfos[0].lowestQuoteTwelveMonths,
      sector: stock.BasicInfos[0].sector,
      higherQuoteTwelveMonths: stock.BasicInfos[0].higherQuoteTwelveMonths,
      subsector: stock.BasicInfos[0].subsector,
      averangeTradingVolumeTwoMonths: stock.BasicInfos[0].averangeTradingVolumeTwoMonths,
      marketValue: stock.BasicInfos[0].marketValue,
      lastBalance: stock.BasicInfos[0].lastBalance,
      firmValue: stock.BasicInfos[0].firmValue,
      numberOfActions: stock.BasicInfos[0].numberOfActions,
      createdAt: stock.BasicInfos[0].createdAt,
      updatedAt: stock.BasicInfos[0].updatedAt
    },
    FundamentalData: {
      P_L: stock.FundamentalData[0].P_L,
      LPA: stock.FundamentalData[0].LPA,
      P_VP: stock.FundamentalData[0].P_VP,
      VPA: stock.FundamentalData[0].VPA,
      P_EBIT: stock.FundamentalData[0].P_EBIT,
      grossMargin: stock.FundamentalData[0].grossMargin,
      PSR: stock.FundamentalData[0].PSR,
      grossEBIT: stock.FundamentalData[0].grossEBIT,
      P_ASSETS: stock.FundamentalData[0].P_ASSETS,
      netMargin: stock.FundamentalData[0].netMargin,
      P_workingCapital: stock.FundamentalData[0].P_workingCapital,
      EBIT_assets: stock.FundamentalData[0].EBIT_assets,
      P_netCircularAsset: stock.FundamentalData[0].P_netCircularAsset,
      ROIC: stock.FundamentalData[0].ROIC,
      dividendYeld: stock.FundamentalData[0].dividendYeld,
      ROE: stock.FundamentalData[0].ROE,
      EV_EBITDA: stock.FundamentalData[0].EV_EBITDA,
      currentLiq: stock.FundamentalData[0].currentLiq,
      EV_EBIT: stock.FundamentalData[0].EV_EBIT,
      grossDebit_patrimony: stock.FundamentalData[0].grossDebit_patrimony,
      netRevenueGrow: stock.FundamentalData[0].netRevenueGrow,
      assetTurnover: stock.FundamentalData[0].assetTurnover,
    },
    IncomeStatementData: {
      resultFinancialIntermediation: stock.IncomeStatementData[0].resultFinancialIntermediation,
      serviceRevenue: stock.IncomeStatementData[0].serviceRevenue,
      netProfit: stock.IncomeStatementData[0].netProfit,
      netRevenue: stock.IncomeStatementData[0].netRevenue,
      EBIT: stock.IncomeStatementData[0].EBIT,
    },
    Oscillations: {
      "2018": stock.Oscillations[0]["2018"],
      "2019": stock.Oscillations[0]["2019"],
      "2020": stock.Oscillations[0]["2020"],
      "2021": stock.Oscillations[0]["2021"],
      "2022": stock.Oscillations[0]["2022"],
      "2023": stock.Oscillations[0]["2023"],
      today: stock.Oscillations[0].today,
      mounth: stock.Oscillations[0].month,
      thirtyDays: stock.Oscillations[0].thirtyDays,
    },
    SheetBalances: {
      active: stock.SheetBalances[0].active,
      deposit: stock.SheetBalances[0].deposit,
      creditCard: stock.SheetBalances[0].creditCard,
      netWorth: stock.SheetBalances[0].netWorth,
      currentAssets: stock.SheetBalances[0].currentAssets,
      disponibilities: stock.SheetBalances[0].disponibilities,
      grossDebit: stock.SheetBalances[0].grossDebit,
      netDebit: stock.SheetBalances[0].netDebit,
    }
  }
}
