import * as stockController from "../controllers/stockController.js";

export default (app) => {
  app.get("/list-stocks", stockController.listStock);

  app.post("/company-overview", stockController.companyOverview);
  app.post("/time-series-daily", stockController.timeSeriesDaily);
};
