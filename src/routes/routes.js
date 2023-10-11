import * as fundamentalData from "./../controllers/fundamentalData.js";

export default (app) => {
  app.get("/list-stocks", fundamentalData.listStock);
};
