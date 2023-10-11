import * as stockController from "../controllers/stockController.js";

export default (app) => {
  app.get("/list-stocks", stockController.listStock);
};
