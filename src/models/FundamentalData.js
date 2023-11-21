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
}

export default FundamentalData;