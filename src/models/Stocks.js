class FundamentalData {
  #URL;
  #API_KEY;
  #apiFunction;

  constructor(URL, API_KEY, apiFunction) {
    this.#URL = URL;
    this.#API_KEY = API_KEY;
    this.#apiFunction = apiFunction;
  }

  get getURL() {
    return this.#URL;
  }

  get getApiKey() {
    return this.#API_KEY;
  }

  get getApiFunction() {
    return this.#apiFunction;
  }

  #formatResponse(response) {
    const keys = response[0].split(",");
    const stockList = [];

    for (let i = 1; i < response.length - 1; i++) {
      const row = response[i].split(",");
      const stock = {
        [keys[0]]: row[0],
        [keys[1]]: row[1],
        [keys[2]]: row[2],
        [keys[3]]: row[3],
        [keys[4]]: row[4],
        [keys[5]]: row[5],
      };

      stockList.push(stock);
    }

    return stockList;
  }

  async listStocks() {
    let response;
    const url = `${this.#URL}function=${this.#apiFunction}&apikey=${
      this.#API_KEY
    }`;

    try {
      response = await fetch(url, {
        method: "get",
      });
    } catch (err) {
      console.error(`Error on fetch listStocks: ${err}`);
    }

    response = await response.text();
    response = response.split("\r\n");

    const stockList = this.#formatResponse(response);

    return stockList;
  }
}

export default FundamentalData;
