import Stocks from "./Stocks.js";

class FundamentalData extends Stocks {
  #symbol;

  constructor(URL, API_KEY, apiFunction, symbol) {
    super(URL, API_KEY, apiFunction);

    this.#symbol = symbol;
  }

  async companyOverview() {
    let response;
    const url = `${this.getURL}function=${this.getApiFunction}&symbol=${
      this.#symbol
    }&apikey=${this.getApiKey}`;

    try {
      response = await fetch(url, { method: "get" });
    } catch (err) {
      console.error(`Error on fetch companyOverview: ${err}`);
    }

    response = await response.text();

    const companyOverview = JSON.parse(response);

    return companyOverview;
  }

  async timeSeriesDaily(outputSize, dataType) {
    /* 
     outputSize = compact or full
      compact - return the last 100 data points
      full - return the last 20 years data points

     datatype = json or csv
    */
    let response;
    const url = 
      `${this.getURL}function=${this.getApiFunction}&symbol=${this.#symbol}&outputsize=${outputSize}&datatype=${dataType}&apikey=${this.getApiKey}`;

    try {
      response = await fetch(url, { method: "get" });
    } catch (err) {
      console.error(`Error on fetch timeSeriesOverview: ${err}`);
    }

    response = await response.text();

    const timeSeriesDaily = JSON.parse(response);

    return timeSeriesDaily;
  }
}

export default FundamentalData;